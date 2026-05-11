const encoder = new ReceiptPrinterEncoder({
    printerModel: "epson-tm-t88v",
    imageMode: "raster",
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

async function send() {
    document.getElementById('form').classList.add('hidden');
    document.getElementById('submit').setAttribute('disabled', 'disabled');
    try {
        const imageEl = document.getElementById("fortuneImage");

        const raw = encoder
            .initialize()
            .align('center')
            .newline() // required to make the align stick
            .line("today's fortune:")
            .newline()
            .size(2)
            .line('NOR')
            .size(1)
            .line("don't bogart me")
            .image(imageEl, 256, 256, "bayer")
            .line('this stuff is for everyone.')
            .line('take what you need')
            .line('as long as you share.')
            .newline()
            .rule({ style: 'double'})
            .newline()
            .line('daily fortunes from')
            .line('zoltan.recurse.com')
            .newline(2)
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
        document.getElementById('response').innerText = "Your fortune awaits you! Specifically, it awaits you at the recipt printer on the fourth floor, next to the printer printer.";
        console.log(result);
    } catch (error) {
        console.error(error.message);
        document.getElementById('response').innerText = error.message;
    }
}

const token = getCookie("receipt_csrf");
if (token) {
    document.getElementById('content').classList.remove('hidden');
    document.getElementById('submit').addEventListener('click', send);
} else {
    document.getElementById('auth').classList.remove('hidden');
}
