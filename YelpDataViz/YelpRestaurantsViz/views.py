from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    existingCities = ['Phoenix','Karlsruhe','Edinburgh','Urbana-Champaign','Charlotte','LasVegas','Waterloo','Pittsburgh','Montreal','Madison']
    return render(request, "canvasParallelCoordinates.html", {'cities': existingCities, 'selectedCity': 'Charlotte'})

def selectCity(request, cityname):
    existingCities = ['Phoenix','Karlsruhe','Edinburgh','Urbana-Champaign','Charlotte','LasVegas','Waterloo','Pittsburgh','Montreal','Madison']
    return render(request, "canvasParallelCoordinates.html", {'cities': existingCities, 'selectedCity': cityname})
