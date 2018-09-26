matches = []

while(True):
	blue1 = input('Blue 1: ')
	blue2 = input('Blue 2: ')
	blue3 = input('Blue 3: ')
	red1 = input('Red 1: ')
	red2 = input('Red 2: ')
	red3 = input('Red 3: ')
	
	matches.append([blue1, blue2, blue3, red1, red2, red3])
	
	next = input('Press enter for match number ' + str(len(matches) + 1) + ' or stop to generate JSON')
	
	if (next != ""):
		break
	
json = '['

for i in range(len(matches)):
	json += "{comp_level:'qm', match_number:'" + str(i + 1) + "', alliances:{blue:{teams:['" + str(matches[i][0]) + "','" + str(matches[i][1]) + "','" + str(matches[i][2]) + "']},red:{teams:['" + str(matches[i][3]) + "','" + str(matches[i][4]) + "','" + str(matches[i][5]) + "']}}},"

json += ']'
	
print(json)