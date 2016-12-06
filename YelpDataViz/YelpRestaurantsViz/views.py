from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    existingCities = ['Phoenix','Karlsruhe','Edinburgh','Urbana-Champaign','Charlotte','LasVegas','Waterloo','Pittsburgh','Montreal','Madison']
    return render(request, "canvasParallelCoordinates - Copy.html", {'cities': existingCities, 'selectedCityName': 'Charlotte', 'selectedCityLatitude': 35.22, 'selectedCityLongitude': -80.84})

def selectCity(request, cityname):
    existingCities = ['Phoenix','Karlsruhe','Edinburgh','Urbana-Champaign','Charlotte','LasVegas','Waterloo','Pittsburgh','Montreal','Madison']
    latitudeDict = {'Phoenix': 33.44,'Karlsruhe': 49.006,'Edinburgh': 55.95,'Urbana-Champaign': 40.110 ,'Charlotte': 35.22,'LasVegas': 36.169,'Waterloo': 43.46,'Pittsburgh': 40.44,'Montreal': 45.50,'Madison': 43.07}
    longitudeDict = {'Phoenix': -112.07,'Karlsruhe': 8.403,'Edinburgh': -3.18,'Urbana-Champaign': -88.207 ,'Charlotte': -80.84,'LasVegas': -115.13,'Waterloo': -80.52,'Pittsburgh': -79.99,'Montreal': -73.56 ,'Madison': -89.40}
    return render(request, "canvasParallelCoordinates - Copy.html", {'cities': existingCities, 'selectedCityName': cityname, 'selectedCityLatitude': latitudeDict[cityname], 'selectedCityLongitude': longitudeDict[cityname]})
