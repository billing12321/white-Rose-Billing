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

// Add Custom Item
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
    
    let qty = 1;
    let total = price * qty;
    
    // Add loading animation to button
    customAddBtn.classList.add("loading");
    
    setTimeout(() => {
        customAddBtn.classList.remove("loading");
    }, 500);
    
    invoiceItems.push({
        name: itemName,
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
                "<td><strong>₹" + it.price.toFixed(2) + "</strong></td>" +
                "<td><strong>" + it.quantity + " KG</strong></td>" +
                "<td><strong>₹" + it.total.toFixed(2) + "</strong></td>" +
                "<td><button onclick='removeItem(" + index + ")' class='remove-btn' style='background: #dc3545; padding: 5px 10px; font-size: 11px;'>✖</button></td>";

            tbody.appendChild(row);
            
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
    let existingNotif = document.querySelector(".notification");
    if (existingNotif) {
        existingNotif.remove();
    }

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

    // Get customer details
    let customer = document.getElementById("customer").value.trim() || "Customer";
    let phone = document.getElementById("phone").value.trim() || "-";
    let bookingno = document.getElementById("bookingno").value.trim() || "-";

    let displayPhone = phone;
    let displayBookingNo = bookingno !== "-" ? "#" + bookingno : "-";

    let dateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    let grand = document.getElementById("grandTotal").innerText;

    let html = "<html><head><meta charset='utf-8'><title>WHITE ROSE EVENTS - Invoice</title>";
    
    html += `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        @page {
            size: A5;
            margin: 0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            width: 148mm;
            min-height: 210mm;
            margin: 0 auto;
            background: white;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        body {
            padding: 0;
            background: white;
            display: flex;
            flex-direction: column;
        }
        
        .invoice {
            width: 148mm;
            max-width: 148mm;
            background: #ffffff;
            margin: 0 auto;
            font-size: 13px;
            display: flex;
            flex-direction: column;
            min-height: 210mm;
        }
        
        .invoice-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0 22px 20px 22px;
        }
        
        /* WHITE BLANK SPACE - 180px */
        .white-blank-space {
            background: #ffffff;
            height: 180px;
            width: 100%;
        }
        
        /* COMPACT BOLD DATE */
        .compact-date {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
            line-height: 1;
        }
        
        .compact-date span {
            background: #f0f4fa;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: #0B2A4A;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            letter-spacing: 0.3px;
        }
        
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
        
        /* COMPACT BOOKING ITEM */
        .booking-item {
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #0B2A4A, #1B3B5C);
            border-radius: 8px;
            padding: 5px 12px;
            border: 1.5px solid #FDBB30;
            box-shadow: 0 4px 10px rgba(253, 187, 48, 0.2);
        }
        
        .booking-icon {
            width: 30px;
            height: 30px;
            background: #FDBB30;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0B2A4A;
            font-size: 16px;
            font-weight: bold;
        }
        
        .booking-details {
            flex: 1;
        }
        
        .booking-label {
            font-size: 9px;
            font-weight: 600;
            color: #FDBB30;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0;
        }
        
        .booking-value-highlight {
            font-size: 18px;
            font-weight: 800;
            color: white;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            letter-spacing: 1px;
        }
        
        .hyphen-value {
            font-size: 15px;
            font-weight: 700;
            color: #999;
            font-style: italic;
        }
        
        .table-wrapper {
            background: #F8FAFE;
            border-radius: 12px;
            padding: 4px;
            border: 1px solid #E9EEF5;
            margin-bottom: 20px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
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
        
        .items-table td:nth-child(2) {
            font-weight: 700;
            color: #0B2A4A;
        }
        
        .grand-total-container {
            margin-top: auto;
            width: 100%;
        }
        
        .grand-total-section {
            padding: 0;
            width: 100%;
        }
        
        .grand-total-simple {
            background: #0B2A4A;
            border-radius: 12px;
            padding: 15px 20px;
            border: 1px solid #FDBB30;
            box-shadow: 0 8px 20px rgba(253, 187, 48, 0.3);
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
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .invoice-footer {
            margin-top: 10px;
            padding: 12px 0 10px;
            border-top: 2px dashed #DDE3EC;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #6B7A8F;
            width: 100%;
        }
        
        .corner-decoration {
            position: fixed;
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
        
        @media print {
            @page {
                size: A5;
                margin: 0;
            }
            
            .white-blank-space {
                background: #ffffff !important;
                height: 180px !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .grand-total-simple {
                background: #0B2A4A !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .booking-item {
                background: #0B2A4A !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .booking-icon {
                background: #FDBB30 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
    `;

    html += "</head><body>";
    html += "<div class='invoice'>";
    html += "<div class='invoice-content'>";
    
    // White space - 180px
    html += "<div class='white-blank-space'></div>";
    
    // Compact date
    html += "<div class='compact-date'>";
    html += "<span>📅 " + dateStr + "</span>";
    html += "</div>";
    
    // Customer Grid
    html += "<div class='customer-grid'>";
    
    // Customer Name
    html += "<div class='customer-item'>";
    html += "<div class='customer-icon'>👤</div>";
    html += "<div class='customer-details'>";
    html += "<div class='customer-label'>Customer Name</div>";
    html += "<div class='customer-value'>" + customer + "</div>";
    html += "</div>";
    html += "</div>";
    
    // Phone
    html += "<div class='customer-item'>";
    html += "<div class='customer-icon'>📞</div>";
    html += "<div class='customer-details'>";
    html += "<div class='customer-label'>Phone Number</div>";
    if (phone !== "-") {
        html += "<div class='phone-value'>" + phone + "</div>";
    } else {
        html += "<div class='hyphen-value'>-</div>";
    }
    html += "</div>";
    html += "</div>";
    
    // Booking - COMPACT VERSION
    if (bookingno !== "-") {
        html += "<div class='booking-item'>";
        html += "<div class='booking-icon'>🔖</div>";
        html += "<div class='booking-details'>";
        html += "<div class='booking-label'>Booking No</div>";
        html += "<div class='booking-value-highlight'>" + displayBookingNo + "</div>";
        html += "</div>";
        html += "</div>";
    } else {
        html += "<div class='customer-item'>";
        html += "<div class='customer-icon'>🔖</div>";
        html += "<div class='customer-details'>";
        html += "<div class='customer-label'>Booking No</div>";
        html += "<div class='hyphen-value'>-</div>";
        html += "</div>";
        html += "</div>";
    }
    
    html += "</div>";
    
    // Table
    html += "<div class='table-wrapper'>";
    html += "<table class='items-table'>";
    html += "<thead><tr><th>Item Description</th><th>Qty (KG)</th><th>Total</th></tr></thead>";
    html += "<tbody>";

    invoiceItems.forEach(it => {
        html += `<tr>
            <td class="item-name"><strong>${it.name}</strong></td>
            <td><strong>${it.quantity} KG</strong></td>
            <td class="item-total"><strong>₹${it.total.toFixed(2)}</strong></td>
        </tr>`;
    });

    html += "</tbody>";
    html += "</table>";
    html += "</div>";
    
    // Grand Total and Footer
    html += "<div class='grand-total-container'>";
    html += "<div class='grand-total-section'>";
    html += "<div class='grand-total-simple'>";
    html += "<div class='grand-total-row-simple'>";
    html += "<span class='grand-total-label-simple'>Grand Total</span>";
    html += "<span class='grand-total-amount-simple'>₹ " + grand + "</span>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    
    html += "<div class='invoice-footer'>";
    html += "<div>Thank you for choosing White Rose Events</div>";
    html += "</div>";
    html += "</div>";
    
    html += "</div>"; // Close invoice-content
    html += "<div class='corner-decoration'>🌹</div>";
    html += "</div>"; // Close invoice
    
    html += `<script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
            window.onafterprint = function() {
                setTimeout(function() {
                    window.close();
                }, 500);
            };
        }
    <\/script>`;
    
    html += "</body></html>";

    const w = window.open('', '_blank', 'width=600,height=800');
    w.document.write(html);
    w.document.close();
    
    setTimeout(function() {
        w.focus();
    }, 500);
    
    showNotification("📄 A5 Invoice generated successfully!", "success");
}

// Keyboard shortcut
document.addEventListener("keypress", function(e) {
    if (e.key === "Enter" && e.target.tagName !== "BUTTON") {
        let addBtn = document.getElementById("addBtn");
        if (document.activeElement === document.getElementById("quantity") ||
            document.activeElement === document.getElementById("item")) {
            addBtn.click();
        }
    }
});

// Quantity validation
document.getElementById("quantity").addEventListener("input", function(e) {
    let value = parseFloat(this.value);
    if (value < 0.5) this.value = 0.5;
    if (value > 100) this.value = 100;
});

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    showNotification("🎉 Welcome to WHITE ROSE EVENTS!", "info");
});
