/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
     const { discount, sale_price, quantity } = purchase;
     const discountMultiplier = 1 - (discount / 100);
      const revenue = sale_price * quantity * discountMultiplier;
     return Math.round(revenue * 100) / 100;
}
   // @TODO: Расчет выручки от операции


/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
     const { profit } = seller;

    if (total === 0) {
      return profit * 0.15;
    } else if (index === 0) {
         return profit * 0.15;
    } else if (index === 1 || index === 2) {
        return profit * 0.10;
    } else if (index === total - 1) {
        return 0;
    } else  {
        return profit * 0.05;
     }
}

    // @TODO: Расчет бонуса от позиции в рейтинге


/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */


function analyzeSalesData(data, options) {
     const { calculateRevenue, calculateBonus } = options; 
    if (!data 
        || !Array.isArray(data.sellers)
        || !Array.isArray(data.products)
        || !Array.isArray(data.purchase_records)
        || data.sellers.length === 0
        || data.products.length === 0
        || data.purchase_records.length === 0
     )  {
        throw new Error ("Неполные входные данные: отсутствуют sellers, products или purchase_records");
    }


        if(typeof calculateRevenue !== "function" 
            || typeof calculateBonus !== "function") {
            throw new Error("опции calculateRevenue и calculateBonus должны быть функциями");
        }

        
      
     const sellerStats = data.sellers.map(seller => ({
        seller_id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: new Map() 
     }));
     const sellerIndex = Object.fromEntries(
         sellerStats.map((stats, index) => [data.sellers[index].id, stats])
     );

     const productIndex = Object.fromEntries(
     data.products.map(product => [product.sku, product])
     );

     data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id];
        if (!seller) return;

        seller.sales_count += 1;

         record.items.forEach(item => {
           const product = productIndex[item.sku];
            if (!product) return;

          
            const revenue = calculateRevenue(item, product);
            const cost = product.purchase_price * item.quantity;
            const profit = revenue - cost;

           seller.revenue += revenue;
           seller.profit += profit;

               const currentQuantity = seller.products_sold.get(item.sku) || 0;
            seller.products_sold.set(item.sku, currentQuantity + item.quantity);
        });
    });

     sellerStats.sort((a, b) => b.profit - a.profit);
     
     sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, sellerStats.length, seller);

        seller.top_products = Array.from(seller.products_sold.entries())
            .map(([sku, quantity]) => ({
                sku,
                quantity
            }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10); 
     }); 
     return sellerStats.map(seller => ({
    seller_id: seller.seller_id, // Строка, идентификатор продавца
    name: seller.name, // Строка, имя продавца
    revenue: Math.round(seller.revenue * 100) / 100, // Число с двумя знаками после точки, выручка продавца
    profit: Math.round(seller.profit * 100) / 100, // Число с двумя знаками после точки, прибыль продавца
    sales_count: seller.sales_count, // Целое число, количество продаж продавца
    top_products: seller.top_products,
    bonus: Math.round(seller.bonus * 100) / 100 // Число с двумя знаками после точки, бонус продавца
   }));
}
   
     

            
    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями

