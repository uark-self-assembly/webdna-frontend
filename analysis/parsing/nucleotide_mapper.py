
def create_mappers(topologyfile):

	with open(topologyfile,'r') as file:
		content = file.read()

	nucleotides = content.split('\n')

	total_nucl = int(nucleotides[0].split(' ')[0])
	total_stra = int(nucleotides[0].split(' ')[1])

	strand_to_sequence = [None for x in range(total_stra+1)] # add one cause strand numbers start at one
	absolute_to_strand = [None for x in range(total_nucl)]
	strand_to_absolute = [[] for x in range(total_stra+1)]

	index = 1
	strand_num = 1
	first_nucl = 0

	while index < total_nucl:

		seq = ''
		data = nucleotides[index].split(' ')
		first_nucl = index
		
		while strand_num == int(data[0]):
			
			absolute_to_strand[index-1] = [ strand_num, index-first_nucl ]
			strand_to_absolute[strand_num].append( (index-1) )
		
			seq += data[1]
			index += 1
			if index <= total_nucl:
				data = nucleotides[index].split(' ')
			else:
				break
				
		strand_to_sequence[strand_num] = seq
		strand_num += 1
	
	return (strand_to_sequence, absolute_to_strand, strand_to_absolute)