from django.shortcuts import render
from .forms import ScreenshotForm
import uuid
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from pyvirtualdisplay import Display

# Create your views here.
def home(request):
    if request.method == "GET":
        context = {}
        context['form'] = ScreenshotForm()
        return render(request, 'screenshot/home.html', context)
    else:
        form = ScreenshotForm(request.POST)
        if form.is_valid():
            with Display():
                url = form.cleaned_data.get('target_url')
                height = form.cleaned_data.get('height')
                width = form.cleaned_data.get('width')
                
                chrome_options = Options()
                chrome_options.add_argument('--headless')
                chrome_options.add_argument('--start-maximized')
                driver = webdriver.Firefox()
                driver.get(url)
                driver.set_window_size(width, height)
                name = uuid.uuid4()
                driver.save_screenshot(f"staticfiles/screenshots/{name}.png")
                driver.quit()

                context = {}
                context['download_path'] = f'staticfiles/screenshots/{name}.png'
                context['form'] = ScreenshotForm()
                return render(request, 'screenshot/home.html', context)
        context = {}
        context['form'] = form
        return render(request, 'screenshot/home.html', context)
