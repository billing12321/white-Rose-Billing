let invoiceItems = [];

function addItem() {
    let itemSelect = document.getElementById("item");
    let qtyInput = document.getElementById("quantity");
    let addBtn = document.getElementById("addBtn");

    let itemName = itemSelect.options[itemSelect.selectedIndex]?.text;
    let price = parseFloat(itemSelect.value);
    let qty = parseFloat(qtyInput.value);

    // Validation
    if (!itemSelect.value || isNaN(price)) {
        showNotification("❌ Please select an item!", "error");
        itemSelect.style.borderColor = "#dc3545";
        return;
    }

    if (isNaN(qty) || qty <= 0) {
        showNotification("❌ Please enter valid quantity!", "error");
        qtyInput.style.borderColor = "#dc3545";
        return;
    }

    // Reset border colors
    itemSelect.style.borderColor = "#e0e8f0";
    qtyInput.style.borderColor = "#e0e8f0";

    let total = price * qty;

    // Add loading animation to button
    addBtn.classList.add("loading");
    
    setTimeout(() => {
        addBtn.classList.remove("loading");
    }, 500);

    invoiceItems.push({
        name: itemName,
        price: price,
        quantity: qty,
        total: total
    });

    renderInvoice();
    showNotification(`✅ ${itemName} added successfully!`, "success");
}

// Add Custom Item - WITHOUT (Custom) tag
function addCustomItem() {
    let customNameInput = document.getElementById("customItemName");
    let customPriceInput = document.getElementById("customItemPrice");
    let customAddBtn = document.getElementById("customAddBtn");
    
    let itemName = customNameInput.value.trim();
    let price = parseFloat(customPriceInput.value);
    
    // Validation
    if (!itemName) {
        showNotification("❌ Please enter item name!", "error");
        customNameInput.style.borderColor = "#dc3545";
        return;
    }
    
    if (isNaN(price) || price <= 0) {
        showNotification("❌ Please enter valid price!", "error");
        customPriceInput.style.borderColor = "#dc3545";
        return;
    }
    
    // Reset border colors
    customNameInput.style.borderColor = "#e0e8f0";
    customPriceInput.style.borderColor = "#e0e8f0";
    
    let qty = 1; // Default quantity for custom items
    let total = price * qty;
    
    // Add loading animation to button
    customAddBtn.classList.add("loading");
    
    setTimeout(() => {
        customAddBtn.classList.remove("loading");
    }, 500);
    
    // Push WITHOUT the "(Custom)" tag
    invoiceItems.push({
        name: itemName,  // Just the name, no (Custom) tag
        price: price,
        quantity: qty,
        total: total
    });
    
    renderInvoice();
    showNotification(`✅ "${itemName}" added successfully!`, "success");
    
    // Clear inputs
    customNameInput.value = "";
    customPriceInput.value = "";
}

function removeItem(index) {
    if (confirm("Are you sure you want to remove this item?")) {
        let removedItem = invoiceItems[index].name;
        invoiceItems.splice(index, 1);
        renderInvoice();
        showNotification(`🗑️ ${removedItem} removed`, "info");
    }
}

function renderInvoice() {
    let tbody = document.querySelector("#invoiceTable tbody");
    let grandEl = document.getElementById("grandTotal");

    tbody.innerHTML = "";
    let grandTotal = 0;

    if (invoiceItems.length === 0) {
        // Show empty state
        let emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td colspan="5" style="text-align: center; padding: 25px; color: #1e3c72; background: #e8eef8; border: 2px dashed #2a5298;">
            🍽️ No items added yet. Add your first item above!
        </td>`;
        tbody.appendChild(emptyRow);
    } else {
        invoiceItems.forEach(function(it, index) {
            let row = document.createElement("tr");
            row.style.animation = `fadeIn 0.3s ease forwards`;
            row.style.opacity = "0";
            
            row.innerHTML =
                "<td><strong>" + it.name + "</strong></td>" +
                "<td>₹" + it.price.toFixed(2) + "</td>" +
                "<td>" + it.quantity + " KG</td>" +
                "<td><strong>₹" + it.total.toFixed(2) + "</strong></td>" +
                "<td><button onclick='removeItem(" + index + ")' class='remove-btn' style='background: #dc3545; padding: 5px 10px; font-size: 11px;'>✖</button></td>";

            tbody.appendChild(row);
            
            // Trigger animation
            setTimeout(() => {
                row.style.opacity = "1";
            }, 10);

            grandTotal += it.total;
        });
    }

    // Animate grand total change
    animateValue(grandEl, parseFloat(grandEl.innerText), grandTotal, 500);
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = start + (end - start) * progress;
        element.innerText = currentValue.toFixed(2);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function showNotification(message, type) {
    // Remove existing notification
    let existingNotif = document.querySelector(".notification");
    if (existingNotif) {
        existingNotif.remove();
    }

    // Create notification element
    let notification = document.createElement("div");
    notification.className = "notification";
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        font-size: 13px;
        z-index: 1000;
        animation: slideInRight 0.3s ease forwards;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;

    // Set color based on type
    switch(type) {
        case "success":
            notification.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
            break;
        case "error":
            notification.style.background = "linear-gradient(135deg, #f43b47, #453a94)";
            break;
        case "info":
            notification.style.background = "linear-gradient(135deg, #36d1dc, #5b86e5)";
            break;
    }

    notification.textContent = message;

    // Add animation styles
    let style = document.createElement("style");
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = "slideInRight 0.3s ease reverse forwards";
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function printInvoice() {
    if (invoiceItems.length === 0) {
        showNotification("❌ No items to print!", "error");
        return;
    }

    // Get customer details - only customer name is required
    let customer = document.getElementById("customer").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let bookingno = document.getElementById("bookingno").value.trim();

    // Only validate customer name (required)
    if (!customer) {
        showNotification("⚠️ Please enter customer name!", "error");
        document.getElementById("customer").style.borderColor = "#dc3545";
        return;
    }

    // Reset border colors
    document.getElementById("customer").style.borderColor = "#e0e8f0";
    document.getElementById("phone").style.borderColor = "#e0e8f0";
    document.getElementById("bookingno").style.borderColor = "#e0e8f0";

    // Use hyphen for empty fields
    let displayPhone = phone ? phone : "-";
    let displayBookingNo = bookingno ? "#" + bookingno : "-";

    let dateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    let grand = document.getElementById("grandTotal").innerText;

    let html = "<html><head><meta charset='utf-8'><title>WHITE ROSE EVENTS - Invoice</title>";
    
    // FORCE A5 FOR ALL DEVICES - CRITICAL META TAGS
    html += `
    <meta name="viewport" content="width=148mm, height=210mm, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    `;
    
    html += `
    <style>
        /* Professional Font Stack - BIGGER AND BOLDER */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        /* FORCE A5 FOR ALL DEVICES */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            width: 148mm;
            height: auto;
            min-height: 210mm;
            margin: 0 auto !important;
            padding: 0 !important;
            background: white;
        }
        
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }
        
        /* Main Invoice Container - Fixed A5 dimensions */
        .invoice {
            width: 148mm;
            min-width: 148mm;
            max-width: 148mm;
            background: #ffffff;
            margin: 0 auto;
            box-shadow: none;
            position: relative;
            overflow: hidden;
            page-break-after: avoid;
            page-break-inside: avoid;
            font-size: 13px;
        }
        
        /* PURE WHITE BLANK SPACE - 150px */
        .white-blank-space {
            background: #ffffff;
            height: 150px;
            width: 100%;
            position: relative;
        }
        
        /* Content Area - Starts directly after white space */
        .invoice-content {
            padding: 0 22px 18px 22px;
            position: relative;
            z-index: 1;
            background: white;
        }
        
        /* Date Panel - First thing after white space */
        .date-panel {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
        }
        
        .date-card {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #F8FAFE;
            padding: 8px 16px;
            border-radius: 12px;
            border: 1px solid #E9EEF5;
        }
        
        .date-icon {
            width: 32px;
            height: 32px;
            background: #FDBB3020;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FDBB30;
            font-size: 14px;
        }
        
        .date-label {
            font-size: 9px;
            font-weight: 600;
            color: #8A99AA;
            text-transform: uppercase;
        }
        
        .date-value {
            font-size: 14px;
            font-weight: 700;
            color: #1B3B5C;
        }
        
        /* Customer Details Grid - Always show all 3 columns with hyphen if empty */
        .customer-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 20px;
            background: #F8FAFE;
            border-radius: 12px;
            padding: 15px;
            border: 1px solid #E9EEF5;
        }
        
        .customer-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .customer-icon {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #0B2A4A, #2A4A6E);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
        }
        
        .customer-details {
            flex: 1;
        }
        
        .customer-label {
            font-size: 9px;
            font-weight: 600;
            color: #6B7A8F;
            text-transform: uppercase;
            margin-bottom: 2px;
        }
        
        .customer-value {
            font-size: 15px;
            font-weight: 700;
            color: #0B2A4A;
        }
        
        .phone-value {
            font-size: 15px;
            font-weight: 700;
            color: #0B2A4A;
            letter-spacing: 0.5px;
        }
        
        .booking-value {
            font-size: 15px;
            font-weight: 700;
            color: #0B2A4A;
            background: white;
            padding: 2px 8px;
            border-radius: 20px;
            display: inline-block;
            border: 1px solid #FDBB30;
        }
        
        /* Style for hyphen (empty fields) */
        .hyphen-value {
            font-size: 15px;
            font-weight: 700;
            color: #999;
            font-style: italic;
        }
        
        /* Section Title */
        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
        }
        
        .section-title-bar {
            width: 5px;
            height: 22px;
            background: linear-gradient(135deg, #FDBB30, #FFD700);
            border-radius: 5px;
        }
        
        .section-title-text {
            font-size: 15px;
            font-weight: 700;
            color: #0B2A4A;
            text-transform: uppercase;
        }
        
        /* Table */
        .table-wrapper {
            background: #F8FAFE;
            border-radius: 12px;
            padding: 4px;
            border: 1px solid #E9EEF5;
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .items-table th {
            text-align: left;
            padding: 12px 10px;
            background: #F0F4FA;
            font-size: 11px;
            font-weight: 700;
            color: #0B2A4A;
            text-transform: uppercase;
            border-bottom: 2px solid #DDE3EC;
        }
        
        .items-table td {
            padding: 10px 10px;
            font-size: 13px;
            color: #2C3E50;
            border-bottom: 1px solid #E9EEF5;
        }
        
        .items-table tr:last-child td {
            border-bottom: none;
        }
        
        .item-name {
            font-weight: 600;
            color: #0B2A4A;
            font-size: 14px;
        }
        
        .item-total {
            font-weight: 700;
            color: #0B2A4A;
            font-size: 14px;
        }
        
        /* ===== SIMPLE GRAND TOTAL SECTION ===== */
        .grand-total-section {
            margin-top: 25px;
            padding: 0;
        }
        
        .grand-total-simple {
            background: #0B2A4A;
            border-radius: 12px;
            padding: 15px 20px;
            border: 1px solid #FDBB30;
        }
        
        .grand-total-row-simple {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .grand-total-label-simple {
            font-size: 16px;
            font-weight: 600;
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .grand-total-amount-simple {
            font-size: 28px;
            font-weight: 700;
            color: #FDBB30;
        }
        
        /* Footer */
        .invoice-footer {
            margin-top: 20px;
            padding: 12px 0 0;
            border-top: 2px dashed #DDE3EC;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #6B7A8F;
        }
        
        /* Decorative Elements */
        .corner-decoration {
            position: absolute;
            bottom: 10px;
            right: 10px;
            opacity: 0.03;
            font-size: 50px;
            font-weight: 800;
            color: #0B2A4A;
            transform: rotate(-10deg);
            z-index: 0;
            pointer-events: none;
        }
        
        /* FORCE A5 PRINT - CRITICAL */
        @media print {
            @page {
                size: A5;
                margin: 0;
            }
            
            html, body {
                width: 148mm;
                height: 210mm;
                background: white;
                padding: 0;
                margin: 0;
            }
            
            body {
                padding: 0;
                background: white;
                display: block;
            }
            
            .invoice {
                width: 148mm;
                min-width: 148mm;
                max-width: 148mm;
                margin: 0 auto;
                box-shadow: none;
                page-break-inside: avoid;
            }
            
            .white-blank-space {
                background: #ffffff !important;
                height: 150px !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .grand-total-simple {
                background: #0B2A4A !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        
        /* FORCE A5 ON MOBILE SCREENS */
        @media screen and (max-width: 600px) {
            html, body {
                width: 148mm;
                margin: 0 auto;
                transform: scale(0.9);
                transform-origin: top center;
            }
        }
    </style>
    `;

    html += "</head><body>";
    html += "<div class='invoice'>";
    
    // PURE WHITE BLANK SPACE - 150px - NO TEXT, NO LOGO, NOTHING
    html += "<div class='white-blank-space'></div>";
    
    // Content
    html += "<div class='invoice-content'>";
    
    // DATE PANEL - First thing after white space
    html += "<div class='date-panel'>";
    html += "<div class='date-card'>";
    html += "<div class='date-icon'>📅</div>";
    html += "<div class='date-info'>";
    html += "<div class='date-label'>Date</div>";
    html += "<div class='date-value'>" + dateStr + "</div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    
    // Customer Details Grid - Show all 3 columns with hyphen for empty fields
    html += "<div class='customer-grid'>";
    
    // Customer Name (always shown)
    html += "<div class='customer-item'>";
    html += "<div class='customer-icon'>👤</div>";
    html += "<div class='customer-details'>";
    html += "<div class='customer-label'>Customer Name</div>";
    html += "<div class='customer-value'>" + customer + "</div>";
    html += "</div>";
    html += "</div>";
    
    // Phone Number (show hyphen if empty)
    html += "<div class='customer-item'>";
    html += "<div class='customer-icon'>📞</div>";
    html += "<div class='customer-details'>";
    html += "<div class='customer-label'>Phone Number</div>";
    if (phone) {
        html += "<div class='phone-value'>" + displayPhone + "</div>";
    } else {
        html += "<div class='hyphen-value'>-</div>";
    }
    html += "</div>";
    html += "</div>";
    
    // Booking Number (show hyphen if empty)
    html += "<div class='customer-item'>";
    html += "<div class='customer-icon'>🔖</div>";
    html += "<div class='customer-details'>";
    html += "<div class='customer-label'>Booking No</div>";
    if (bookingno) {
        html += "<div class='booking-value'>" + displayBookingNo + "</div>";
    } else {
        html += "<div class='hyphen-value'>-</div>";
    }
    html += "</div>";
    html += "</div>";
    
    html += "</div>";
    
    // Section Title
    html += "<div class='section-title'>";
    html += "<div class='section-title-bar'></div>";
    html += "<div class='section-title-text'>Order Summary</div>";
    html += "</div>";
    
    // Table
    html += "<div class='table-wrapper'>";
    html += "<table class='items-table'>";
    html += "<thead>";
    html += "<tr>";
    html += "<th>Item Description</th>";
    html += "<th>Qty (KG)</th>";
    html += "<th>Total</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";

    invoiceItems.forEach(it => {
        html += `<tr>
            <td class="item-name">${it.name}</td>
            <td>${it.quantity} KG</td>
            <td class="item-total">₹${it.total.toFixed(2)}</td>
        </tr>`;
    });

    html += "</tbody>";
    html += "</table>";
    html += "</div>";
    
    // ===== SIMPLE GRAND TOTAL SECTION - NO MONEY BAG ICON =====
    html += "<div class='grand-total-section'>";
    html += "<div class='grand-total-simple'>";
    html += "<div class='grand-total-row-simple'>";
    
    // Simple Grand Total label (no icon)
    html += "<span class='grand-total-label-simple'>Grand Total</span>";
    
    // Simple amount with just ₹ and number
    html += "<span class='grand-total-amount-simple'>₹ " + grand + "</span>";
    
    html += "</div>"; // Close grand-total-row-simple
    html += "</div>"; // Close grand-total-simple
    html += "</div>"; // Close grand-total-section
    
    // Footer
    html += "<div class='invoice-footer'>";
    html += "<div>Thank you for choosing White Rose Events</div>";
    html += "</div>";
    
    // Decorative Element
    html += "<div class='corner-decoration'>🌹</div>";
    
    html += "</div>"; // Close invoice-content
    html += "</div>"; // Close invoice
    
    // FORCE A5 PRINT WITH JAVASCRIPT
    html += `<script>
        // Force A5 paper settings
        window.onload = function() {
            // Set viewport to A5 dimensions
            var meta = document.createElement('meta');
            meta.name = "viewport";
            meta.content = "width=148mm, height=210mm, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
            document.getElementsByTagName('head')[0].appendChild(meta);
            
            // Force print dialog with A5
            setTimeout(function() {
                window.print();
            }, 500);
            
            // Close after print
            window.onafterprint = function() {
                setTimeout(function() {
                    window.close();
                }, 500);
            };
        }
    <\/script>`;
    
    html += "</body></html>";

    // Open print window with A5 dimensions
    const w = window.open('', '_blank', 'width=600,height=800');
    w.document.write(html);
    w.document.close();
    
    setTimeout(function() {
        w.focus();
    }, 500);
    
    showNotification("📄 A5 Invoice generated successfully!", "success");
}

// Add keyboard shortcut for adding items (Enter key)
document.addEventListener("keypress", function(e) {
    if (e.key === "Enter" && e.target.tagName !== "BUTTON") {
        let addBtn = document.getElementById("addBtn");
        if (document.activeElement === document.getElementById("quantity") ||
            document.activeElement === document.getElementById("item")) {
            addBtn.click();
        }
    }
});

// Input validation for quantity
document.getElementById("quantity").addEventListener("input", function(e) {
    let value = parseFloat(this.value);
    if (value < 0.5) this.value = 0.5;
    if (value > 100) this.value = 100;
});

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    showNotification("🎉 Welcome to WHITE ROSE EVENTS!", "info");
});
