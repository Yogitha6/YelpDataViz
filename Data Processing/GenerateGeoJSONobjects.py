import csv
import sys

def uprint(*objects, sep=' ', end='\n', file=sys.stdout):
    enc = file.encoding
    if enc == 'UTF-8':
        print(*objects, sep=sep, end=end, file=file)
    else:
        f = lambda obj: str(obj).encode(enc, errors='backslashreplace').decode(enc)
        print(*map(f, objects), sep=sep, end=end, file=file)
uprint("{")
uprint("   \"type\": \"FeatureCollection\",")
uprint("   \"features\": [")
with open('Business_Cuisine.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        uprint("  {")
        uprint("    \"type\": \"Feature\",")
        uprint("    \"geometry\": {")
        uprint("        \"type\": \"Point\",")
        uprint("        \"coordinates\":  [{0},{1}]".format(row['Longitude'], row['Latitude']))
        uprint("    },")
        uprint("    \"properties\": {")
        uprint("    \"business_id\":\"{0}\",".format(row['Business_id']))
        uprint("    \"name\":\"{0}\",".format(row['Name']))
        uprint("    \"city\":\"{0}\",".format(row['City']))
        uprint("    \"attributes.Price Range\":\"{0}\",".format(row['Price Range']))
        uprint("    \"review_count\":\"{0}\",".format(row['Review Count']))
        uprint("    \"stars\":\"{0}\",".format(row['Stars']))
        uprint("    \"cuisine\":\"{0}\",".format(row['Cuisine']))
        uprint("    }")
        uprint("  },")
uprint("]")
uprint("}")
