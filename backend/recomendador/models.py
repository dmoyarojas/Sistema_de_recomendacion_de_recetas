from django.db import models

# Create your models here.


#Clase Ingrediente
class Ingrediente(models.Model):
    nombre= models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name_plural= "Ingredientes"



#Clase Receta

class Receta(models.Model):
    nombre=models.CharField(max_length=200, unique=True)
    descripcion=models.TextField()

    #esta es la relación muchos a muchos que pasa a traves de la tabla intermedia RecetaIngrediente
    ingredientes = models.ManyToManyField(Ingrediente, through='RecetaIngrediente')

    def __str__(self):
        return self.nombre
    


#Clase RecetaIngrediente

class RecetaIngrediente(models.Model):

    #Relaciones con receta e ingredientee
    receta= models.ForeignKey(Receta, on_delete=models.CASCADE)
    ingrediente = models.ForeignKey(Ingrediente, on_delete=models.CASCADE)

    #aca se pondra la cantidad de cada ingrediente 
    cantidad_requerida=models.CharField(max_length=50) 

    class Meta:
        unique_together = ('receta', 'ingrediente')

    #funcion str para mostrar la relacion entre receta e ingrediente
    def __str__(self):
        return f"{self.receta.nombre} requiere {self.cantidad_requerida} de {self.ingrediente.nombre}"