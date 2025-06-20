from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    # React tarafının beklediği `id` alanını `id_from_json` alanından alalım
    id = serializers.CharField(source='id_from_json', read_only=True)

    class Meta:
        model = Customer
        # React tarafına gönderilecek alanları belirliyoruz
        fields = [
            'id', 
            'accountCode', 
            'name', 
            'phone', 
            'balance', 
            'lastInvoiceDate', 
            'lastPaymentDate', 
            'status'
        ]

class UserSerializer(serializers.ModelSerializer):
    # Şifreyi sadece yazma işlemi için kullan, asla geri döndürme (bu sayede şifre hashlenmiş olsa bile içbir zaman json'da gözükmez ve güvenlik sağlanmış olur)
    password = serializers.CharField(write_only=True)
    # React'ten gelen 'name' alanını, Django'daki 'first_name' alanına eşle
    name = serializers.CharField(source='first_name', write_only=True)

    def create(self, validated_data):
        # Kullanıcı adını (username) e-posta adresinden al. Bu, hem benzersizliği hem de geçerli formatı garanti eder.
        user = User.objects.create_user(
            username=validated_data['email'].lower(), # EN ÖNEMLİ DEĞİŞİKLİK (bu sayede kullanıcı isimlerinin değil emaillerin benzersiz olması koşulu oluşur) 
            email=validated_data['email'].lower(),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', '') # Eşlediğimiz 'name' alanını kaydet
        )
        return user

    class Meta:
        model = User
        # Frontend'den hala 'name', 'email', 'password' bekliyoruz.
        fields = ['id', 'name', 'email', 'password']