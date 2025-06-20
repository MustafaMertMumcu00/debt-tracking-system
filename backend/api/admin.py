from django.contrib import admin
from .models import Customer # Customer modelimizi import ediyoruz

# Customer modelini admin paneline kaydediyoruz
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    # Admin panelinde hangi alanların görüneceğini belirliyoruz
    list_display = ('name', 'user', 'accountCode', 'balance', 'status', 'lastInvoiceDate')
    # Hangi alanlara göre filtreleme yapabileceğimizi belirliyoruz
    list_filter = ('status', 'user')
    # Hangi alanlarda arama yapabileceğimizi belirliyoruz
    search_fields = ('name', 'accountCode', 'user__username')