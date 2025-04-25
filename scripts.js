// Tab switching functionality
function switchTab(tabId) {
    console.log("switchTab called with: " + tabId); // Debug logging
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Deactivate all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Activate selected tab and content
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
        const tabButton = document.querySelector(`.tab[onclick*="'${tabId}'"]`);
        if (tabButton) {
            tabButton.classList.add('active');
        } else {
            console.error("Tab button for " + tabId + " not found");
        }
    } else {
        console.error("Tab content with ID " + tabId + " not found");
    }
}

// Mobile menu toggle
function toggleMenu() {
    console.log("toggleMenu called"); // Debug logging
    const tabsMenu = document.getElementById('tabs-menu');
    if (tabsMenu) {
        if (tabsMenu.classList.contains('show')) {
            tabsMenu.classList.remove('show');
        } else {
            tabsMenu.classList.add('show');
        }
    } else {
        console.error("Tabs menu not found");
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const tabsMenu = document.getElementById('tabs-menu');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (tabsMenu && tabsMenu.classList.contains('show') && 
        event.target !== tabsMenu && 
        event.target !== menuToggle && 
        !tabsMenu.contains(event.target) && 
        !menuToggle.contains(event.target)) {
        tabsMenu.classList.remove('show');
    }
});

// Close menu when a tab is clicked
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabsMenu = document.getElementById('tabs-menu');
            if (tabsMenu) {
                tabsMenu.classList.remove('show');
            }
        });
    });
});

// Calendar functionality
let currentDate = new Date();
let selectedDate = null;

function initCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = 
            `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const today = new Date();

    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    calendarDays.innerHTML = '';

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-empty-day';
        emptyDay.style.cssText = 'aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: none; cursor: default;';
        calendarDays.appendChild(emptyDay);
    }

    // Add the days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.dataset.day = day; // Add data attribute for easier selection
        dayElement.style.cssText = 'aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background-color: #0a1832; color: #c4a55c; font-size: 12px; border: 1px solid #c4a55c; cursor: pointer;';
        
        // Only highlight today's date if we're in the current month and year
        if (currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth() &&
            day === today.getDate()) {
            // Apply a different style for today instead of using the same style as selected
            dayElement.style.border = '2px solid #c4a55c';
            dayElement.style.fontWeight = 'bold';
        }
        
        // Check if this day is the selected date
        if (selectedDate && 
            currentDate.getFullYear() === selectedDate.getFullYear() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            day === selectedDate.getDate()) {
            // Apply selected styling
            dayElement.style.cssText = 'aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background-color: #c4a55c !important; color: #000000 !important; font-weight: bold !important; border: 2px solid #f7d57f !important; font-size: 12px; cursor: pointer;';
        }
        
        dayElement.textContent = day;
        dayElement.addEventListener('click', function() {
            selectDate(day, this);
        });
        calendarDays.appendChild(dayElement);
    }
    
    console.log('Calendar days rendered:', calendarDays.children.length, 'days');
}

function selectDate(day, element) {
    // Set the selected date
    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    console.log('Date selected:', day);
    
    // Reset all day cells (only those with the calendar-day class)
    document.querySelectorAll('#calendarDays .calendar-day').forEach(el => {
        el.style.backgroundColor = '#0a1832';
        el.style.color = '#c4a55c';
        el.style.fontWeight = 'normal';
        el.style.border = '1px solid #c4a55c';
        
        // Preserve the today highlighting if needed
        const today = new Date();
        const cellDay = parseInt(el.dataset.day);
        
        if (currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth() &&
            cellDay === today.getDate()) {
            el.style.border = '2px solid #c4a55c';
            el.style.fontWeight = 'bold';
        }
    });
    
    // Apply selected styling with !important flag to override any conflicting styles
    element.style.cssText = 'aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background-color: #c4a55c !important; color: #000000 !important; font-weight: bold !important; border: 2px solid #f7d57f !important; font-size: 12px; cursor: pointer;';
    
    // Double-check that the style was applied
    setTimeout(() => {
        if (element.style.backgroundColor !== 'rgb(196, 165, 92)') {
            // Force the style again if needed
            element.style.setProperty('background-color', '#c4a55c', 'important');
            element.style.setProperty('color', '#000000', 'important');
        }
    }, 10);
}

function scheduleAppointment(type) {
    if (!selectedDate) {
        alert("Please select a date");
        return;
    }
    
    const timeSelect = document.getElementById('timeSelect');
    if (!timeSelect) return;
    
    const time = timeSelect.value;
    if (!time) {
        alert("Please select a time");
        return;
    }

    // Create and show the contact form
    const modal = document.getElementById('schedule-modal');
    if (!modal) return;
    
    const modalContent = modal.querySelector('div');
    if (!modalContent) return;

    // Save the original content
    const originalContent = modalContent.innerHTML;

    // Replace with contact form
    modalContent.innerHTML = `
        <span id="back-to-calendar" style="position: absolute; top: 10px; right: 20px; font-size: 24px; cursor: pointer; color: #c4a55c;">&times;</span>
        <h3 style="text-align: center; color: #c4a55c; margin-top: 0;">Complete Your ${type.charAt(0).toUpperCase() + type.slice(1)} Request</h3>
        <p style="text-align: center;">Date: ${selectedDate.toDateString()} at ${time}</p>

        <form id="appointment-form">
            <div style="margin-bottom: 15px;">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #c4a55c; background-color: rgba(10, 24, 50, 0.7) !important; color: #c4a55c !important;" required>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="address">Address:</label>
                <input type="text" id="address" name="address" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #c4a55c; background-color: rgba(10, 24, 50, 0.7) !important; color: #c4a55c !important;" required>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="zipcode">Zip Code:</label>
                <input type="text" id="zipcode" name="zipcode" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #c4a55c; background-color: rgba(10, 24, 50, 0.7) !important; color: #c4a55c !important;" required>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #c4a55c; background-color: rgba(10, 24, 50, 0.7) !important; color: #c4a55c !important;" required>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #c4a55c; background-color: rgba(10, 24, 50, 0.7) !important; color: #c4a55c !important;" required>
            </div>

            <div style="margin-bottom: 15px;">
                <label for="order">Order Number (optional):</label>
                <input type="text" id="order" name="order" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #c4a55c; background-color: rgba(10, 24, 50, 0.7) !important; color: #c4a55c !important;">
            </div>

            <div style="text-align: center;">
                <button type="submit" style="background-color: #0a1832 !important; color: #c4a55c !important; border: 2px solid #c4a55c !important; padding: 10px 20px; cursor: pointer; font-weight: bold;">Confirm Appointment</button>
            </div>
        </form>
    `;

    // Add event listener for form submission
    try {
        const form = document.getElementById('appointment-form');
        if (!form) {
            console.error('Form element not found');
            return;
        }
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const zipCode = document.getElementById('zipcode').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const orderNumber = document.getElementById('order').value;

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = "Processing...";
            submitBtn.disabled = true;

            // Form submission to Google Apps Script
            const formSubmit = document.createElement('form');
            formSubmit.method = 'POST';
            formSubmit.action = 'https://script.google.com/macros/s/AKfycbzjqQsInM24ZLzj4HPod0YI4HvnlkwI7erqSqd67_YCo5tNvV1bc1KOEma_JYmV0DLl/exec';
            formSubmit.target = '_blank'; // This will open a new tab/window

            // Add form fields
            const addField = (name, value) => {
                const field = document.createElement('input');
                field.type = 'hidden';
                field.name = name;
                field.value = value;
                formSubmit.appendChild(field);
            };

            addField('name', name);
            addField('address', address);
            addField('zipCode', zipCode);
            addField('phone', phone);
            addField('email', email);
            addField('orderNumber', orderNumber);
            addField('date', selectedDate.toDateString());
            addField('time', time);
            addField('type', type);

            // Submit the form
            document.body.appendChild(formSubmit);
            formSubmit.submit();
            document.body.removeChild(formSubmit);

            // Show success message
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} appointment request submitted. Check your email for confirmation.`);
            modalContent.innerHTML = originalContent;
            initCalendar();
            modal.style.display = 'none';
        });
    } catch (err) {
        console.error('Error setting up form submission:', err);
    }

    // Add event listener for back button
    const backButton = document.getElementById('back-to-calendar');
    if (backButton) {
        backButton.addEventListener('click', function() {
            modalContent.innerHTML = originalContent;
            initCalendar();
            const closeModal = document.getElementById('close-schedule-modal');
            if (closeModal) {
                closeModal.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            }
        });
    }
}

// Document ready event handler
document.addEventListener('DOMContentLoaded', function() {
    // Force dark background on page load
    document.body.style.backgroundColor = '#0a1832';
    document.querySelectorAll('.page-wrapper, .container, .tab-content, .site-title, .nav-container').forEach(el => {
        el.style.backgroundColor = '#0a1832';
    });
    
    // Ensure all text elements have gold color
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, a, label, span').forEach(el => {
        el.style.color = '#c4a55c';
    });
    
    // Fix bullet points if needed
    document.querySelectorAll('li').forEach(li => {
        // Check if the bullet point is visible
        const computedStyle = window.getComputedStyle(li, ':before');
        if (computedStyle.content === 'none' || computedStyle.display === 'none') {
            // Add a visible bullet point
            li.style.position = 'relative';
            li.style.paddingLeft = '20px';
            li.style.textAlign = 'left';
            li.style.display = 'flex';
            li.style.alignItems = 'flex-start';
            
            // Add a bullet using ::before if it doesn't exist
            const styleTag = document.createElement('style');
            styleTag.textContent = `
                li:before {
                    content: "•" !important;
                    color: #c4a55c !important;
                    position: absolute !important;
                    left: 5px !important;
                    top: 0 !important;
                    font-size: 16px !important;
                }
            `;
            document.head.appendChild(styleTag);
        }
    });
    
    // Setup schedule modal
    const scheduleButtons = document.querySelectorAll('#schedule-button, #schedule-button-contact');
    const scheduleModal = document.getElementById('schedule-modal');
    const closeModal = document.getElementById('close-schedule-modal');
    
    if (scheduleButtons && scheduleModal && closeModal) {
        scheduleButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                scheduleModal.style.display = 'block';
                try {
                    initCalendar(); // Initialize the calendar when modal opens
                } catch (err) {
                    console.error('Calendar initialization error:', err);
                }
            });
        });
        
        closeModal.addEventListener('click', function() {
            scheduleModal.style.display = 'none';
        });
        
        // Close modal when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target === scheduleModal) {
                scheduleModal.style.display = 'none';
            }
        });
    }
    
    // Initialize prev/next month buttons if they exist
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            initCalendar();
        });
        
        nextMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            initCalendar();
        });
    }
});