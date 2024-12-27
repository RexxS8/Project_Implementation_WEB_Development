# implementations/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, login_view, index, project_list, project_detail

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('', index, name='index'),
    path('login/', login_view, name='login'),
    path('api/', include(router.urls)),
    path('api/project_list/', project_list, name='project_list'),
    path('api/project_detail/<int:pk>/', project_detail, name='project_detail'),
]
