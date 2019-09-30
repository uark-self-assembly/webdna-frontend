
import sys

output_file = open( sys.argv[2] ,'w')

try:
	with open( sys.argv[1] ,'r') as infile:
		for line in infile:
			if 'ENDMDL' not in line:
				output_file.write(line)
			else:
				output_file.write('ENDMDL')
				break
except Exception as e:
    print e

output_file.close()