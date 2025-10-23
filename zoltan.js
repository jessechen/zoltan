const encoder = new ReceiptPrinterEncoder();

function tokenFrom(cookie) {
  return (
    cookie
      .split("; ")
      .find((row) => row.startsWith("receipt_csrf="))
      ?.split("=")[1] || ""
  );
}

function send() {
    const raw = encoder
        .initialize()
        .align('center')
        .line("today's fortune:")
        .newline()
        .size(2)
        .line('NAND')
        .size(1)
        .line("don't bogart me")
        .newline()
        .line('this stuff is for everyone.')
        .line('take what you need')
        .line('as long as you share.')
        .newline()
        .line('zoltan.recurse.com')
        .cut()
        .encode();

    console.log(raw);
}

const token = tokenFrom(document.cookie);
if (token) {
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
    document.getElementById('submit').addEventListener('click', send);
}
