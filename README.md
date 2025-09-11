# Darius Portfolio - Django Edition

Ito ay isang modernong portfolio website na binuo gamit ang Django backend at vanilla JavaScript frontend na may advanced na features kabilang ang admin-editable content at custom email notifications.

## 🚀 Mga Tampok

- **Django Backend** - Admin-editable na lahat ng portfolio content
- **Custom Client-side Router** - Smooth navigation without page refresh
- **Newsletter System** - May email alert para sa mga nag-subscribe
- **Custom Notification System** - showSuccess, showError, at showInfo popups
- **Interactive Contact Page** - May live map integration
- **Responsive Design** - Gumaganda sa lahat ng device sizes gamit ang Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Django** - Python web framework para sa backend
- **Django Admin** - Content management system
- **Email Integration** - Para sa newsletter at contact form notifications

### Frontend
- **Vanilla JavaScript** - Custom router at interactive features
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Custom JavaScript** - Para sa notifications at dynamic content

### APIs at Integrations
- **Map Provider** (Google Maps/Leaflet) - Para sa live map sa contact page
- **Email Service** (SMTP/SendGrid/Mailgun) - Para sa email notifications

## 📁 Project Structure

```
darius-portfolio/
├── backend/                 # Django project
│   ├── portfolio/          # Main Django app
│   │   ├── models.py       # Database models para sa editable content
│   │   ├── admin.py        # Admin configuration
│   │   ├── views.py        # API endpoints para sa content
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

Ang proyektong ito ay gumagamit ng custom client-side router para sa seamless navigation:

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
# Django view para sa newsletter subscription
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
            
            # I-save ang email sa database
            subscriber, created = Subscriber.objects.get_or_create(email=email)
            
            if created:
                # Magpadala ng confirmation email
                send_mail(
                    'Subscription Confirmation',
                    'Thank you for subscribing to my newsletter!',
                    'noreply@darius.com',
                    [email],
                    fail_silently=False,
                )
                
                # Magpadala ng alert sa admin
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

## 🏗️ Django Models para sa Editable Content

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

## 🚀 Paano I-setup ang Project

1. **I-clone ang repository**
   ```bash
   git clone <repository-url>
   cd darius-portfolio
   ```

2. **I-setup ang backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # o
   venv\Scripts\activate  # Windows
   
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **I-setup ang frontend**
   - Ang static files ay naka-serve na through Django
   - I-configure ang email settings sa `settings.py`
   - I-configure ang map provider API keys

4. **Access ang admin panel**
   - Pumunta sa `/admin` at i-login gamit ang superuser account
   - Idagdag ang portfolio content sa pamamagitan ng admin interface

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
   - Gumamit ng environment variables para sa sensitive data
   - I-enable ang HTTPS
   - Gumamit ng secure headers
   - Regular na i-update ang dependencies

## 📄 Mga Pahina

- **Home** - Introduksyon at highlight ng mga skills (editable sa admin)
- **About** - Detalyadong impormasyon tungkol sa akin (editable sa admin)
- **Projects** - Gallery ng mga projects (editable sa admin)
- **Blog** - Mga blog posts (editable sa admin)
- **Contact** - Contact form na may live map at notification system

Ang portfolio na ito ay dinisenyo upang ipakita ang aking mga kasanayan sa full-stack development at para magbigay ng magandang user experience sa mga bisita. Lahat ng content ay madaling i-edit sa pamamagitan ng Django admin interface.
