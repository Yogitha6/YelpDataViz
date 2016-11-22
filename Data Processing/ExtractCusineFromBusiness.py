import csv
import sys
import codecs
import ast

def uprint(*objects, sep=' ', end='\n', file=sys.stdout):
    enc = file.encoding
    if enc == 'UTF-8':
        print(*objects, sep=sep, end=end, file=file)
    else:
        f = lambda obj: str(obj).encode(enc, errors='backslashreplace').decode(enc)
        print(*map(f, objects), sep=sep, end=end, file=file)

def getCuisine(categories):
    cuisine = 'Anonymous'
    categoriesList = ast.literal_eval(categories)
    cuisineList = ['Japanese','Sushi Bars', 'Dim Sum', 'Thai', 'Vegetarian', 'Indian', 'Greek', 'Middle Eastern', 'Chinese', 'Hawaiian', 'Vietnamese', 'Asian Fusion', 'Korean', 'Italian', 'British', 'American (Traditional)', 'American (New)', 'Mediterranean', 'Seafood', 'French', 'Steakhouses', 'Coffee & Tea', 'Breakfast & Brunch', 'Cafes', 'Mexican', 'Tex-Mex', 'Chicken Wings', 'Fast Food', 'Hot Dogs', 'Burgers', 'Pizza', 'Barbeque', 'Canadian (New)', 'New Mexican Cuisine', 'Beijing Chinese Cuisine', 'Cantonese']
    for category in categoriesList:
        if category in cuisineList:
            return category
    return cuisine

with open('Business.csv', encoding="utf8") as csvfile:
    reader = csv.DictReader(csvfile)
    businessId = ' '
    name = ' '
    city = ' '
    price = ' '
    reviewCount = ' '
    stars = ' '
    latitude = ' '
    longitude = ' '
    categories = ' '
    for row in reader:
        businessId = row['business_id']
        name = row['name']
        city = row['city']
        price = row['attributes.Price Range']
        reviewCount = row['review_count']
        stars = row['stars']
        latitude = row['latitude']
        longitude = row['longitude']
        categories = getCuisine(row['categories'])
        uprint("{0},{1},{2},{3},{4},{5},{6},{7},{8}".format(businessId, name, city, price, reviewCount, stars, latitude, longitude, categories))
