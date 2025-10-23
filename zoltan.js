const encoder = new ReceiptPrinterEncoder();

const result = encoder
    .line('The is the first line')
    .line('And this is the second')
    .encode();

console.log(result);
