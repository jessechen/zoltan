const encoder = new ReceiptPrinterEncoder({
    printerModel: "epson-tm-t88v",
    imageMode: "raster",
});

let fortuneId = 0;
const fortunes = [];
// Here they are! Was this approach more satisfying than comparing them with other people?
fortunes.push({
    title: 'AND',
    imageId: 'andImage',
    subtitle: 'i want it all',
    text: ['yolo, all in!', 'if you shoot for the moon and miss,', 'you\'ll land among the stars.'],
});
fortunes.push({
    title: 'OR',
    imageId: 'orImage',
    subtitle: 'more is more',
    text: ['why not both?', 'if either is good,', 'do you really have to choose?'],
});
fortunes.push({
    title: 'XOR',
    imageId: 'xorImage',
    subtitle: 'don\'t overdo it',
    text: ['laser. focus.', 'if you chase two rabbits,', 'you will lose them both.'],
});
fortunes.push({
    title: 'NAND',
    imageId: 'nandImage',
    subtitle: 'sharing is caring',
    text: ['this stuff is for everyone.', 'take what you need', 'as long as you share.'],
});
fortunes.push({
    title: 'NOR',
    imageId: 'norImage',
    subtitle: 'not today, world',
    text: ['you can always opt out.', 'participate in an unfair system?', 'i would prefer not to.'],
});
fortunes.push({
    title: 'XNOR',
    imageId: 'xnorImage',
    subtitle: 'all or nothing',
    text: ['go big or go home.', 'if it\'s worth doing,', 'it\'s worth doing right.'],
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

async function send() {
    if (fortuneId === 0) {
        return;
    }
    const fortune = fortunes[fortuneId];
    document.getElementById('form').classList.add('hidden');
    document.getElementById('submit').setAttribute('disabled', 'disabled');
    try {
        const imageEl = document.getElementById(fortune.imageId);

        const raw = encoder
            .initialize()
            .align('center')
            .newline() // required to make the align stick
            .line("today's fortune:")
            .newline()
            .size(2)
            .line(fortune.title)
            .size(1)
            .line(fortune.subtitle)
            .image(imageEl, 256, 256, "bayer")
            .line(fortune.text[0])
            .line(fortune.text[1])
            .line(fortune.text[2])
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
    const rng = new RNG(Date.now().toDateString() + token);
    fortuneId = Math.floor(rng.uniform() * 6);
    document.getElementById('content').classList.remove('hidden');
    document.getElementById('submit').addEventListener('click', send);
} else {
    document.getElementById('auth').classList.remove('hidden');
}
