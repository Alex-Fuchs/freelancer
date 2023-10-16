from django.conf.urls.static import static
from django.conf import settings
from django.urls import path

from . import views

urlpatterns = [
    path('data/order', views.order_data, name='order_data'),
    path('data/job', views.job_data, name='job_data'),
    path('data/invoice', views.send_invoice, name='send_invoice'),
    path('data/report', views.send_report, name='send_report'),
    path('auth/signIn',  views.sign_in, name='sign_in'),
    path('auth/change',  views.change_account, name='change_account')
]