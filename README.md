# Darius Portfolio - Django Edition

A modern portfolio website built with Django backend and vanilla JavaScript frontend, featuring admin-editable content, custom email notifications, and interactive elements.

## 🚀 Features

- **Django Backend** - All portfolio content editable via admin interface
- **Custom Client-side Router** - Smooth navigation without page refresh
- **Newsletter System** - Email alerts for new subscribers
- **Custom Notification System** - showSuccess, showError, and showInfo popups
- **Interactive Contact Page** - Live map integration
- **Responsive Design** - Optimized for all device sizes using Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Django** - Python web framework for backend
- **Django Admin** - Content management system
- **Email Integration** - For newsletter and contact form notifications

### Frontend
- **Vanilla JavaScript** - Custom router and interactive features
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Custom JavaScript** - For notifications and dynamic content

### APIs & Integrations
- **Map Provider** (Google Maps/Leaflet) - For live map on contact page
- **Email Service** (SMTP/SendGrid/Mailgun) - For email notifications

## 📁 Project Structure

```
darius-portfolio/
├── backend/                 # Django project
│   ├── portfolio/          # Main Django app
│   │   ├── models.py       # Database models for editable content
│   │   ├── admin.py        # Admin configuration
│   │   ├── views.py        # API endpoints for content
│   │   └── urls.py         # URL routes
│   ├── templates/          # Django templates
│   └── requirements.txt    # Python dependencies
├── frontend/               # Static files
│   ├── js/
│   │   ├── router.js       # Custom JavaScript router
│   │   ├── notifications.js # Notification system
│   │   └── main.js         # Main JavaScript file
│   ├── css/
│   │   └── styles.css      # Custom styles
│   └── index.html          # Main template
└── README.md
```

## 🎯 Custom Router Implementation

This project uses a custom client-side router for seamless navigation:

```javascript
// js/router.js
class CustomRouter {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }
    
    init() {
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            document.body.addEventListener('click', (e) => {
                if (e.target.matches('[data-route]')) {
                    e.preventDefault();
                    this.navigate(e.target.href);
                }
            });
            
            this.handleRoute(window.location.pathname);
        });
    }
    
    navigate(path) {
        window.history.pushState({}, path, window.location.origin + path);
        this.handleRoute(path);
    }
    
    async handleRoute(path) {
        const route = this.routes[path] || this.routes['/404'];
        const html = await fetch(route.template).then(res => res.text());
        document.getElementById('main-content').innerHTML = html;
        
        if (route.init) {
            route.init();
        }
        
        window.scrollTo(0, 0);
    }
}

// Define routes
const routes = {
    '/': {
        template: '/templates/home.html',
        init: () => { /* Home page initialization */ }
    },
    '/about': {
        template: '/templates/about.html',
        init: () => { /* About page initialization */ }
    },
    '/projects': {
        template: '/templates/projects.html',
        init: () => { /* Projects page initialization */ }
    },
    '/blog': {
        template: '/templates/blog.html',
        init: () => { /* Blog page initialization */ }
    },
    '/contact': {
        template: '/templates/contact.html',
        init: () => { 
            // Initialize map
            initMap();
        }
    }
};

// Initialize router
const router = new CustomRouter(routes);
```

## 🔔 Notification System

```javascript
// js/notifications.js
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showInfo(message) {
    showNotification(message, 'info');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`;
    notification.textContent = message;
    notification.style.zIndex = 1000;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}
```

## 📧 Newsletter Subscription

```python
# Django view for newsletter subscription
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def subscribe_newsletter(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            # Save email to database
            subscriber, created = Subscriber.objects.get_or_create(email=email)
            
            if created:
                # Send confirmation email
                send_mail(
                    'Subscription Confirmation',
                    'Thank you for subscribing to my newsletter!',
                    'noreply@darius.com',
                    [email],
                    fail_silently=False,
                )
                
                # Send alert to admin
                send_mail(
                    'New Newsletter Subscription',
                    f'New subscriber: {email}',
                    'noreply@darius.com',
                    ['admin@darius.com'],
                    fail_silently=False,
                )
                
                return JsonResponse({'status': 'success', 'message': 'Successfully subscribed!'})
            else:
                return JsonResponse({'status': 'info', 'message': 'Email already subscribed.'})
                
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'An error occurred. Please try again.'})
```

## 🗺️ Live Map Integration

```html
<!-- contact.html -->
<div class="container mx-auto px-4 py-12">
    <h2 class="text-3xl font-bold text-center mb-8">Contact Me</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <!-- Contact form -->
            <form id="contact-form">
                <!-- Form fields here -->
            </form>
        </div>
        <div>
            <!-- Live map -->
            <div id="map" class="h-64 md:h-full rounded-lg shadow-lg"></div>
        </div>
    </div>
</div>

<script>
function initMap() {
    // Initialize map based on your preferred provider (Google Maps/Leaflet)
    const mapElement = document.getElementById('map');
    const latitude = 14.5995; // Manila coordinates
    const longitude = 120.9842;
    
    // Example with Leaflet
    const map = L.map('map').setView([latitude, longitude], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Openstreetmap</a> contributors'
    }).addTo(map);
    
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup('My Location<br>Manila, Philippines')
        .openPopup();
}
</script>
```

## 🏗️ Django Models for Editable Content

```python
# models.py
from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    bio = models.TextField()
    image = models.ImageField(upload_to='profile/')
    resume = models.FileField(upload_to='resumes/')
    
    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    technologies = models.CharField(max_length=200)
    project_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    excerpt = models.TextField(max_length=300)
    image = models.ImageField(upload_to='blog/')
    date_published = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True)
    
    def __str__(self):
        return self.title

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    date_subscribed = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email
```

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd darius-portfolio
   ```

2. **Setup backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate  # Windows
   
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Setup frontend**
   - Static files are served through Django
   - Configure email settings in `settings.py`
   - Configure map provider API keys

4. **Access admin panel**
   - Navigate to `/admin` and login with superuser account
   - Add portfolio content through the admin interface

## ⚡ Production Deployment Tips

1. **Django Production Settings**
   ```python
   # settings.py
   DEBUG = False
   ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
   
   # Email Configuration
   EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
   EMAIL_HOST = 'smtp.your-email-provider.com'
   EMAIL_PORT = 587
   EMAIL_USE_TLS = True
   EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
   EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD')
   ```

2. **Static Files**
   ```python
   # settings.py
   STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
   STATICFILES_DIRS = [os.path.join(BASE_DIR, 'frontend')]
   ```

3. **Security Considerations**
   - Use environment variables for sensitive data
   - Enable HTTPS
   - Implement secure headers
   - Regularly update dependencies

## 📄 Pages

- **Home** - Introduction and skills highlights (editable via admin)
- **About** - Detailed information about me (editable via admin)
- **Projects** - Project gallery (editable via admin)
- **Blog** - Blog posts (editable via admin)
- **Contact** - Contact form with live map and notification system

This portfolio is designed to showcase my full-stack development skills while providing an excellent user experience for visitors. All content is easily editable through the Django admin interface.
