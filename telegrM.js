// ФУНКЦИЯ ОТПРАВКИ В TELEGRAM (ПРОВЕРЕННАЯ)
async function sendToTelegram(orderData) {
    try {
        // 1. ФОРМИРУЕМ СООБЩЕНИЕ
        let message = `🛒 НОВЫЙ ЗАКАЗ НА САЙТЕ\n\n`;
        message += `📋 Номер заказа: ${orderData.orderId}\n`;
        message += `👤 Имя: ${orderData.name}\n`;
        message += `📞 Телефон: ${orderData.phone}\n`;
        message += `📧 Email: ${orderData.email}\n`;
        message += `📍 Адрес: ${orderData.address}\n`;
        message += `📅 Дата: ${orderData.date}\n`;
        
        if (orderData.comment && orderData.comment !== 'нет') {
            message += `💬 Комментарий: ${orderData.comment}\n`;
        }
        
        message += `\n📦 ТОВАРЫ:\n`;
        
        orderData.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            message += `${index + 1}. ${item.name}\n`;
            message += `   ${item.quantity} шт. × ${item.price.toLocaleString()} ₽ = ${itemTotal.toLocaleString()} ₽\n`;
        });
        
        message += `\n💰 ИТОГО: ${orderData.total.toLocaleString()} ₽\n`;
        message += `\n🕐 Время заказа: ${new Date().toLocaleTimeString('ru-RU')}`;
        
        // 2. ВАШИ ДАННЫЕ TELEGRAM
        const botToken = '6312669631:AAHHByEyFk_RI9Pq_5BSzQdWOwOFdp5TPLc';
        const chatId = '421332431';
        
        // 3. КОДИРУЕМ СООБЩЕНИЕ ДЛЯ URL
        const encodedMessage = encodeURIComponent(message);
        
        // 4. ФОРМИРУЕМ URL
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}`;
        
        console.log('Telegram URL (укороченный):', url.substring(0, 100) + '...');
        
        // 5. ОТПРАВЛЯЕМ ЗАПРОС
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const result = await response.json();
        console.log('Ответ Telegram:', result);
        
        return {
            success: result.ok === true,
            messageId: result.result?.message_id,
            error: result.ok ? null : result.description
        };
        
    } catch (error) {
        console.warn('Ошибка Telegram:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}