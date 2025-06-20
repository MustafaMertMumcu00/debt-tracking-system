from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from .models import Customer
from .serializers import CustomerSerializer, UserSerializer

# POST /api/register
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # E-postanın zaten kullanımda olup olmadığını kontrol et
        email = request.data.get('email', '').lower()
        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {"success": False, "message": "This email address is already in use."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"success": True, "message": "User registered successfully!"},
            status=status.HTTP_201_CREATED
        )


# POST /api/login
class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # React tarafının beklediği formatta cevap dönelim
        return Response({
            'success': True,
            'token': token.key, # Güvenlik için token döndürüyoruz
            'user': {
                'id': user.pk, # Django'da user id'si pk olarak geçer
                'name': user.first_name or user.username,
                'email': user.email
            }
        })

# GET /api/customers/ (Node.js'teki :userId'ye gerek yok, token'dan kullanıcıyı bulacağız)
class CustomerListView(generics.ListAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated] # Sadece giriş yapanlar görebilir

    def get_queryset(self):
        # Sadece isteği yapan kullanıcıya ait müşterileri listele
        return Customer.objects.filter(user=self.request.user)

# POST /api/customers/send
class SendConfirmationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        customer_ids = request.data.get('customerIds', [])
        message = request.data.get('message', '') # Mesajı alıyoruz ama şimdilik kullanmıyoruz (Whatsapp Business kısmı gelince bağlamayı deneyebiliriz)

        if not customer_ids:
            return Response(
                {"success": False, "message": "Invalid data provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Sadece bu kullanıcıya ait olan ve ID'leri listede olan müşterileri güncelle
        updated_count = Customer.objects.filter(
            user=request.user,
            id_from_json__in=customer_ids
        ).update(status='pending')
        
        return Response({
            "success": True,
            "message": f"Requests sent to {len(customer_ids)} selected customers."
        })
    