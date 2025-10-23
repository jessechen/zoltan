const encoder = new ReceiptPrinterEncoder({
    printerModel: "epson-tm-t88v"
});

function tokenFrom(cookie) {
  return (
    cookie
      .split("; ")
      .find((row) => row.startsWith("receipt_csrf="))
      ?.split("=")[1] || ""
  );
}

async function send() {
    try {
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
            .rule({ style: 'single'})
            .line('zoltan.recurse.com')
            .cut()
            .encode();

        const response = await fetch("https://receipt.recurse.com/escpos", {
            method: "POST",
            body: raw,
            credentials: "include",
            headers: { "X-CSRF-Token": token, "Content-Type": "application/octet-stream" },
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

const token = tokenFrom(document.cookie);
if (token) {
    document.getElementById('content').classList.remove('hidden');
    document.getElementById('submit').addEventListener('click', send);
} else {
    document.getElementById('auth').classList.remove('hidden');
}
