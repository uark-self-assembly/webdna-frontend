
#!/usr/bin/env python

import base
try:
    import numpy as np
except:
    import mynumpy as np
import os.path
import sys
import readers 
import subprocess
import tempfile
import json

import nucleotide_mapper

def print_progress( current, total, first=False ):
	message = "Parsing through trajectory file :\t["
	for i in range(total):
		if i < current:
			message += "-"
		else:
			message += " "
	message += "] {:2d}%".format( 100*current/total )
	if not first:
		print "\b" * (42+total) ,
	print message ,
	sys.stdout.flush()

command_for_data =  'analysis_data_output_1 = { \n name = stdout \n print_every = 1 \n col_1 = { \n type=pair_energy \n} \n}'
PROCESSPROGRAM = "DNAnalysis"

if (len(sys.argv) < 3):
  print 'Usage %s <input-file> <trajectory.dat> <generated.top>' % sys.argv[0]
  sys.exit()

#now get topology file name:
inputfile = sys.argv[1]
conffile = sys.argv[2]
topologyfile = sys.argv[3]

with open(conffile,'r') as infile:
	total_frames = infile.read().count( 't = ' )

myreader = readers.LorenzoReader(conffile,topologyfile)
mysystem = myreader.get_system()

counter = 0
prev_config = None
tempfile_obj = tempfile.NamedTemporaryFile()
launchargs = [PROCESSPROGRAM,inputfile,'trajectory_file='+tempfile_obj.name,command_for_data]
num_nucleotides = mysystem.get_num_nucleotides()

last_recorded_time = 0
running_data_structure = []
strand_to_sequence, absolute_to_strand, strand_to_absolute = nucleotide_mapper.create_mappers(topologyfile)

full_data_structure = {
	"num_nuc":len(absolute_to_strand),
	"num_str":len(strand_to_sequence),
	"str_seq":strand_to_sequence,
	"nuc_str":absolute_to_strand,
	"str_nuc":strand_to_absolute,
	"min_time":mysystem._time }
	
print_progress( 0, total_frames, True )

while mysystem != False:

	mysystem.map_nucleotides_to_strands()
	mysystem.print_lorenzo_output(tempfile_obj.name,'/dev/null')
	tempfile_obj.flush()
	myinput = subprocess.Popen(launchargs,stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	stdout,stderr = myinput.communicate()
	linewise = stdout.split('\n')
	mysystem.read_H_bonds(linewise[:-1])
	
	curr_config = mysystem.get_H_interactions_nucleotides()
			
	if prev_config == None:
	
		for NP in curr_config:	
			if mysystem != None and NP != None and absolute_to_strand != None:
					running_data_structure.append( [mysystem._time, int(NP[0]), absolute_to_strand[NP[0]][0], 'BINDS', int(NP[1]), absolute_to_strand[NP[1]][0]] )
	
	elif prev_config != curr_config:
	
		for NP in prev_config:
			if NP not in curr_config:
				if mysystem != None and NP != None and absolute_to_strand != None:
					running_data_structure.append( [mysystem._time, int(NP[0]), absolute_to_strand[NP[0]][0], 'BREAK', int(NP[1]), absolute_to_strand[NP[1]][0]] )
					# f.write( '\t\t'.join( [str(mysystem._time), str(NP[0]), str(absolute_to_strand[NP[0]][0]), 'BREAK', str(NP[1]), str(absolute_to_strand[NP[1]][0])] ) + '\n' )
		
		for NP in curr_config:
			if NP not in prev_config:
				if mysystem != None and NP != None and absolute_to_strand != None:
					running_data_structure.append( [mysystem._time, int(NP[0]), absolute_to_strand[NP[0]][0], 'BINDS', int(NP[1]), absolute_to_strand[NP[1]][0]] )
					# f.write( '\t\t'.join( [str(mysystem._time), str(NP[0]), str(absolute_to_strand[NP[0]][0]), 'BINDS', str(NP[1]), str(absolute_to_strand[NP[1]][0])] ) + '\n' )
	
	prev_config = curr_config
	last_recorded_time = mysystem._time
	mysystem = myreader.get_system()
	counter += 1
	
	print_progress( counter, total_frames )

if counter == 0:
	print "ERROR : Invalid trajectory file, no timesteps recorded"
	sys.exit(1)

if counter == 1:
	full_data_structure['time_step'] = 1
else:
	full_data_structure['time_step'] = (last_recorded_time-full_data_structure['min_time']) / (counter-1)

full_data_structure['max_time'] = last_recorded_time
full_data_structure['data'] = running_data_structure

with open('bond_data.json','w') as file:
	json.dump( full_data_structure, file )
