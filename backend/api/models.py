from django.db import models
from django.contrib.auth.models import User

# Müşteri durumları için seçenekler
STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('rejected', 'Rejected'),
]

class Customer(models.Model):
    # Bu müşteri hangi kullanıcıya ait?
    user = models.ForeignKey(User, related_name='customers', on_delete=models.CASCADE)
    
    # db.json'daki string ID'leri (cust_101 gibi) uyumluluk için saklayalım
    id_from_json = models.CharField(max_length=50, unique=True, help_text="Original ID from db.json for mapping")
    
    # Diğer alanlar
    accountCode = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, blank=True)
    
    # Para birimi için FloatField yerine DecimalField kullandım daha mantıklı olduğu için
    balance = models.DecimalField(max_digits=12, decimal_places=2) 
    
    lastInvoiceDate = models.DateField(null=True, blank=True)
    lastPaymentDate = models.DateField(null=True, blank=True)
    
    # Seçenekli alan
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['name'] # Müşterileri isme göre sırala

    def __str__(self):
        return self.name