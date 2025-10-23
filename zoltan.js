const encoder = new ReceiptPrinterEncoder();

const raw = encoder
    .initialize()
    .align('center')
    .line("today's fortune:")
    .newline()
    .size(2)
    .line('NAND')
    .size(1)
    .line('no bogarting')
    .newline()
    .line('this stuff is for everyone.')
    .line('take what you need')
    .line('as long as you share.')
    .newline()
    .line('zoltan.recurse.com')
    .cut()
    .encode();

console.log(raw);
