from rest_framework import permissions
from rest_framework.views import APIView
from .models import Contact
from django.core.mail import send_mail
from rest_framework.response import Response
from real_estate.settings import EMAIL_HOST_USER

class ContactCreateView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data 

        try:
            send_mail(
                 data['subject'],
                 f'Name: {data["name"]}\nEmail: {data["email"]}\n\nMessage:\n{data["message"]}',
                 EMAIL_HOST_USER,
                 [EMAIL_HOST_USER, 'mwojdynadevcon@gmail.com'],
                 fail_silently=False
            )
            contact = Contact(name=data['name'], email=data['email'], subject=data['subject'], message=data['message'])
            contact.save()
            return Response({'success':'message sent successfully'})
        except:
            return Response({'error': 'message failed to send'})