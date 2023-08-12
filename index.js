
"use strict";
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const { downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor, pickRandom, randomNomor } = require('./lib/console.js')
const { isUrl, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid, fetchJson, getBuffer } = require("./lib/myfunc");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/addlist');

// apinya
const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");

// Database
const setting = JSON.parse(fs.readFileSync('./setting.json'));
const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
const mess = JSON.parse(fs.readFileSync('./mess.json'));
const db_error = JSON.parse(fs.readFileSync('./database/error.json'));
const db_respon_list = JSON.parse(fs.readFileSync('./database/list.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async(ramz, msg, m, setting, store) => {
try {
let { ownerNumber, botName } = setting
const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${setting.ownerNumber}`,"6285647299390@s.whatsapp.net","6281327393959@s.whatsapp.net","6289513081052@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = ramz.user.id.split(':')[0] + '@s.whatsapp.net'

// Group
const groupMetadata = isGroup ? await ramz.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false

// Quoted
const quoted = msg.quoted ? msg.quoted : msg
const isImage = (type == 'imageMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isVideo = (type == 'videoMessage')
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isSticker = (type == 'stickerMessage')
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList

function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = ramz.sendMessage(from, { text: teks, mentions: mems })
return res
} else {
let res = ramz.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res
}
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []



const reply = (teks) => {ramz.sendMessage(from, { text: teks }, { quoted: msg })}

//Antilink
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.includes(`https://chat.whatsapp.com/`) || budy.includes(`http://chat.whatsapp.com/`)) {
if (!isBotGroupAdmins) return reply('Untung bot bukan admin')
if (isOwner) return reply('Untung lu owner ku:v😙')
if (isGroupAdmins) return reply('Admin grup mah bebas ygy🤭')
if (fromMe) return reply('bot bebas Share link')
await conn.sendMessage(from, { delete: msg.key })
reply(`*「 GROUP LINK DETECTOR 」*\n\nTerdeteksi mengirim link group,Maaf sepertinya kamu akan di kick`)
conn.groupParticipantsUpdate(from, [sender], "remove")
}
}

// Response Addlist
if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
var get_data_respon = getDataResponList(from, chats, db_respon_list)
if (get_data_respon.isImage === false) {
ramz.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
quoted: msg
})
} else {
ramz.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
quoted: msg
})
}
}

const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return ramz.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}


const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `Created By Ari Setiawan\n`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;AriBOT,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: 'https://telegra.ph/file/3c485ff201d9337be14ef.jpg' }}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}


// Console
if (isGroup && isCmd) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
}

if (!isGroup && isCmd) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
}

// Menu nya
switch(command) {
	case 'help':
	case 'menu':{
		const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Creator by - ${setting.ownerName}`
	let menu = `━━━━━[ 𝘼𝙍𝙄 𝙑𝙋𝙉 𝙎𝙏𝙊𝙍𝙀 ]━━━━━


┏━━━『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』━━━━━◧
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${setting.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${setting.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${setting.ownerName} 
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ 
┃
┗━━━━━━━━━━━━━━━━━━◧
┏━━━━『 𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .mainmenu 
┣» .owmermenu
┣» .grupmenu
┃
┣» .listproduk
┣» .kalkulator
┣» .script
┣» .owner
┣» .donasi
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
ramz.sendMessage(from, {audio: {url: `./gambar/suara.mp3`}, mimetype:'audio/mpeg', ptt:true})
}
break
case 'mainmenu':{
	let menu = `
┏━━━━『 𝙈𝙖𝙞𝙣 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .produk
┣» .listproduk
┣» .donasi
┣» .ping
┣» .test
┣» .pembayaran 
┣» .bayar
┣» .script
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: mainmenu}, {quoted: fkontak})
}
break
case 'grupmenu':{
	let menu = `
┏━━━━『 𝙂𝙧𝙤𝙪𝙥 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .hidetag
┣» .group open
┣» .group close 
┣» .antilink on
┣» .antilink off
┣» .kick 
┃
┣» .addlist
┣» .dellist
┣» .list
┣» .shop
┣» .hapuslist
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'ownermenu':{
	let menu = `
┏━━━━『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .p / .d
┣» .join
┣» .sendbyr 62xxx
┣» .block 62xxx 
┣» .unblock 62xxx
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'kalkulator':{
	let menu = `
┏━━━━『 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』━━━━◧
┃
┣» .tambah
┣» .kali
┣» .bagi
┣» .kurang
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: menu}, {quoted: fkontak})
}
break
case 'list':
case 'listproduk':
case 'produk':{
const mark_slebew = '0@s.whatsapp.net'
const more = String.fromCharCode(8206)
const strip_ny = more.repeat(4001)
var footer_nya =`Creator by - ${setting.ownerName}`
let tampilan_nya = `ʜᴀʟʟᴏ ʙʀᴏ.. 👋 
ᴘᴇʀᴋᴇɴᴀʟᴋᴀɴ ꜱᴀʏᴀ ᴀᴅᴀʟᴀʜ ʀᴏʙᴏᴛ ʀᴀɴᴄᴀɴɢᴀɴ ᴅᴀʀɪ ᴀʀɪ ᴠᴘɴ ꜱᴛᴏʀᴇ. 
ʙᴇʀɪᴋᴜᴛ ʟɪꜱᴛ ᴘʀᴏᴅᴜᴋ 🙏 ,
ᴊᴀɴɢᴀɴ ʟᴜᴘᴀ ᴜɴᴛᴜᴋ ᴏʀᴅᴇʀ ʏᴀ👍
┏━━━━『 𝙈𝙀𝙉𝙐 𝙎𝙏𝙊𝙍𝙀 』━━━━◧
┃
┣» .vpn (LIST SERVER PREMIUM)
┣» .vps (LIST HARGA VPS)
┣» .ytpem (LIST YT PREMIUM 4&6BUALN)
┣» .bot (LIST HARGA BOT PANEL)
┣» .flex (HARGA KUOTA TEMBAK FLEX)
┃
┗━━━━━━━━━━━━━━━━━━◧`
ramz.sendMessage(from, {text: tampilan_nya}, {quoted: fkontak})
}
ramz.sendMessage(from, {audio: {url: `./gambar/Halo.mp3`}, mimetype:'audio/mpeg', ptt:true})
break
case 'yt':
case 'youtube':
	ramz.sendMessage(from, 
{text: `Jangan Lupa Subscriber yah kak😉🙏
*Link* : https://youtube.com/@arivpnstore123`},
{quoted: msg})
break
case 'ig':
case 'instagram':
	ramz.sendMessage(from, {text: `Admin Kurang ngurus ig uyy Jadi subscribe aja YouTube admin\n\nLink https://youtube.com/@arivpnstore123`},
{quoted: msg})
break
case 'gc':
case 'groupadmin':
	ramz.sendMessage(from, 
{text: `*RAJA SERVER PREMIUM*\n
GRUP : https://chat.whatsapp.com/C3MmpDbhnxs551jQLnMg2Y `},
{quoted: msg})
break
case 'donasi': case 'donate':{
let tekssss = ` ───「  *DONASI*  」────

💵PEMBAYARAN VIA ALL PAYMET :
💳DANA : 081327393959
💳LINK AJA : 081327393959
💳OVO : 081327393959 
💳GOPAY VIA QRIS
💳SHOPEEPAY VIA QRIS
💳BRI MOBILE QRIS
💳PULSA NOMER TRANSAKSI : 081327393959
berapapun donasi dari kalian itu sangat berarti bagi kami `

ramz.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2023`},
{quoted: msg})
}
break
case 'join':{
 if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} _linkgrup_`)
var ini_urrrl = q.split('https://chat.whatsapp.com/')[1]
var data = await ramz.groupAcceptInvite(ini_urrrl)
reply('*Sukses Join The Group..*')
}
break
// PEMBAYARAN 
case 'tf':
case 'payment':
case 'buy':
case 'b':
case 'pembayaran':
case 'bayar':{
	if (isGroup) return 
let tekssss = `───「  TRANFER VIA QRIS  」────
💵PEMBAYARAN VIA ALL PAYMET :
💳 BANK NEO COMMERCE  : 5859459402005390
💳DANA : 081327393959
💳LINK AJA : 081327393959
💳OVO : 081327393959
💳SHOPEEPAY : 081327393959 
💳NEOBANK : 081327393959
💳GOPAY VIA QRIS 
💳BNI MOBILE VIA QRIS
💳BCA MOBILE VIA QRIS 
💳BRI MOBILE QRIS
💳LIVIN MANDIRI VIA QRIS
💳PULSA NOMER TRANSAKSI : 081327393959
Jika Sudah di tranfer Secrenshoot bukti pembayaran Dan segera saya preses😉`
ramz.sendMessage(from, { image: fs.readFileSync(`./gambar/qris.jpg`),
 caption: tekssss, 
footer: `${setting.ownerName} © 2023`},
{quoted: msg})
}
break
// LIST PENJUAL 
case 'r':{
let teq =` 
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*REQUEST ACCOUNTS*
Mode? Ssh,vmess,trojan 
USERNAME :
PASSWORD :
EXP (BERAPA HARI) :
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 
`
ramz.sendMessage(from, {text: teq}, {quoted: fkontak})
}
break
case 'v':
case 'vpn':
case 'promosi':{
let teq =`*🔰👑𝗥𝗔𝗝𝗔 𝗦𝗘𝗩𝗘𝗥 𝗣𝗥𝗘𝗠𝗜𝗨𝗠👑🔰*
=================================
*🥇𝙱𝚈 𝙰𝚁𝙸 𝚅𝙿𝙽 𝚂𝚃𝙾𝚁𝙴🥇*
=================================
PILIH MODE INJECT NYA          
1. SSH WEBSOCKET Account
2. SSH SelowDNS Account
3. OPEN SSH Account 
4. SSH UDP Account
5. Xray/Vmess Account
6. Xray/Vless Account
7. Trojan Account
8. ShadowsocksR  Account 
9. Shadowsocks-Libev Account
=================================                       
*SERVER SINGAPURA✓*
ISP : Digital Ocean
1. sgpremium.my.id 
🇸🇬SG VIP :  Rp 1.750 (3 HARI)
🇸🇬SG VIP :  Rp 2.000 (7 HARI)
🇸🇬SG VIP :  Rp 3.500 (15 HARI)
🇸🇬SG VIP :  Rp 5.000 (22 HARI) 
🇸🇬SG VIP :  Rp 7.000 (30 HARI)
🇸🇬SG VIP :  Rp 15.000 (60 HARI) 
=================================
ISP : Digital Ocean
2. vvip.sgpremium.my.id
🇸🇬SG VVIP : Rp 2.000 (3 HARI)
🇸🇬SG VVIP : Rp 3.500 (7 HARI)
🇸🇬SG VVIP : Rp 5.000 (15 HARI)
🇸🇬SG VVIP :  Rp 7.000 (22 HARI) 
🇸🇬SG VVIP : Rp 10.000 (30 HARI)
🇸🇬SG VVIP : Rp 20.000 (60 HARI) 
=================================
ISP : Digital Ocean
3. new.sgpremium.my.id
🇸🇬SG RESEL : Rp 5.000 (30 HARI) MINIMAL 2 AKUN
=================================
*SERVER INDONESIA✓*
ISP : PT Cloud Hosting Indonesia
4. idc.idpremium.my.id
🇮🇩IDC :  Rp 3.500 (3 HARI)
🇮🇩IDC :  Rp 5.000 (7 HARI)
🇮🇩IDC :  Rp 7.000 (15 HARI)
🇮🇩IDC :  Rp 10.000 (22 HARI) 
🇮🇩IDC :  Rp 12.000 (30 HARI)
🇮🇩IDC :  Rp 22.000 (60 HARI) 
=================================
ISP :  Media Antar Nusa PT.
5. nusa.idpremium.my.id
🇮🇩ID NUSA :  Rp 3.500 (3 HARI)
🇮🇩ID NUSA :  Rp 5.000 (7 HARI)
🇮🇩ID NUSA :  Rp 7.000 (15 HARI)
🇮🇩ID NUSA :  Rp 10.000 (22 HARI) 
🇮🇩ID NUSA :  Rp 12.000 (30 HARI)
🇮🇩ID NUSA :  Rp 22.000 (60 HARI) 
====================================
ISP : CV. Rumahweb Indonesia
6. rumahweb.idpremium.my.id
🇮🇩ID RUMAHWEB :  Rp 2.000 (3 HARI)
🇮🇩ID RUMAHWEB :  Rp 3.500 (7 HARI)
🇮🇩ID RUMAHWEB :  Rp 5.000 (15 HARI)
🇮🇩ID RUMAHWEB :  Rp 7.000 (22 HARI) 
🇮🇩ID RUMAHWEB :  Rp 10.000 (30 HARI) 
🇮🇩ID RUMAHWEB :  Rp 20.000 (60 HARI) 
=================================
ISP : PT Herza Digital Indonesia (LIMIT SPEED <50Mbps)
7. hezra.idpremium.my.id
🇮🇩ID HERZA :  Rp 2.000 (3 HARI)
🇮🇩ID HERZA :  Rp 3.500 (7 HARI)
🇮🇩ID HERZA :  Rp 5.000 (15 HARI)
🇮🇩ID HERZA :  Rp 7.000 (22 HARI) 
🇮🇩ID HERZA :  Rp 10.000 (30 HARI)
🇮🇩ID HERZA :  Rp 20.000 (60 HARI) 
=================================
Khusus Pulsa : ↙️
Harga +5k
====================================
• TUTOR BUAT CONFIG Rp 1.000
• CONFIG PREMIUM DARI SAYA GRATIS
====================================
✅BISA TRIAL DULU
===================================
💵PEMBAYARAN VIA ALL PAYMET :
💳DANA VIA QRIS
💳LINKAJA VIA QRIS
💳OVO VIA QRIS
💳SHOPEEPAY VIA QRIS 
💳GOPAY VIA QRIS
💳BRI MOBILE VIA QRIS
💳PULSA *(NOMER TRANSAKSI PULSA CHAT ADMIN, HARGA PULSA BERBEDA)*
Jika Sudah di tranfer Secrenshoot bukti pembayaran Dan segera saya preses😉
=====================================
*✅KELEBIHAN BELI AKUN PREMIUM✅*
UNLIMITED BANDWIDTH SERVER INDONESIA
SUPRORT STB OPENWRT✓ 
Nonton YouTube Lancar  4K✓
Server Tidak Gampang Error✓
Buat Download Fast Speed✓
ANTI RECONNECT✓
Support Video Call (GANTI UDP 7100-7900)✓
Support GAME (TERGANTUNG TKP)✓
Koneksi stabil ✓
Fast Connect ✓
Garansi 100%✓
Bonus Config✓
DLL
=====================================
*⚙️PENGATURAN PEMBELI⚙️*
NO DDOS !!!
NO HACKING !!! 
NO CARDING !!!
NO TORRENT !!!
NO SPAMMING !!! 
NO PLAYING PLAYSTATION !!!
MAX 2 Device !!!
*Melanggar AUTO BAN!!!*                               
=====================================
☎️MINAT ?? HUBUNGI : 
✅WhatsApp : wa.me/+6281327393959 
✅Telegram   : https://t.me/ARI_VPN_STORE
✅Testimoni  : t.me/RAJA_VPN_STORE
✅GROUP WA : https://chat.whatsapp.com/C3MmpDbhnxs551jQLnMg2Y
✅100% Amanah🙏
✅SUDAH TERPERCAYA 😉`
ramz.sendMessage(from, {text: teq}, {quoted: fkontak})
}
break
case 'rdp':
case 'vps':
case 'vpsdo':{
let teq =` Stock VPS DigitalOcean :

Spesifikasi :
~ Ram 1Gb Memory
~ vCPU 1 Core
~ Bandwidth 1TB
~ Storage 25Gb
Harga : Rp. 40.000 

Spesifikasi :
~ Ram 2Gb Memory
~ vCPU 1 Core
~ Bandwidth 2TB
~ Storage 50Gb
Harga : Rp. 50.000

Spesifikasi :
~ Ram 2Gb Memory
~ vCPU 2 Core
~ Bandwidth 3TB
~ Storage 60Gb
Harga : Rp. 65.000 

Spesifikasi :
~ Ram 4Gb Memory
~ vCPU 2 Core
~ Bandwidth 4TB
~ Storage 80Gb
Harga : Rp. 80.000 

Spesifikasi :
~ Ram 8Gb Memory
~ vCPU 4 Core
~ Bandwidth 5TB
~ Storage 160Gb
Harga : Rp. 120.000

*INFO VPS!!*
-DAPET SC POTATO TUNNELING 1 BULAN
-DAPET HOST GRATIS
-SIAP UNTUK JUALAN SSH, XRAY, TROJAN DLL

*##NOMER ADMIN*
☎️MINAT ?? HUBUNGI : 
✅WhatsApp : wa.me/+6281327393959 
✅Telegram   : https://t.me/ARI_VPN_STORE
✅Testimoni  : t.me/RAJA_VPN_STORE
✅GROUP WA : https://chat.whatsapp.com/C3MmpDbhnxs551jQLnMg2Y
✅100% Amanah🙏
✅SUDAH TERPERCAYA 😉 `
ramz.sendMessage(from, {text: teq}, {quoted: fkontak})
}

break
case 'bot':{
let tek =`_• *ARI PANEL BOT bulan an*_

*PAKET 1*
*RAM 1GB 25% CPU*
*Harga: Rp 5.000*
 
*PAKET 2*
*RAM 2GB 50% CPU*
*Harga: Rp 10.000*

*PAKET 3*
*RAM 3GB 100% CPU*
*Harga: Rp 15.000*

*PAKET 4*
*RAM 4GB 125% CPU*
*Harga: Rp 20.000*

*PAKET 5*
*RAM 4GB 150% CPU*
*Harga: Rp 25.000*

*PAKET VIP*
*RAM UNLIMITED & CPU UNLIMITED*
*Harga Rp: 40.000*

*PAKET VVIP*
*RAM UNLIMITED & CPU UNLIMITED*
*BONUS SC LINDUT-MD*
*Harga Rp: 50.000*

*ADMIN FAST RESPON!!!*

✨ᴘᴇʀᴘᴀɴᴊᴀɴɢ ɴᴏ ʀɪʙᴇᴛ 
✨ᴅɪ ᴊᴀᴍɪɴ 𝟷𝟶𝟶% ᴍᴜʀᴀʜ 
✨ɴᴏ ᴛɪᴘᴜ + ᴛᴇsᴛɪ ʙᴀɴʏᴀᴋ
✨ʙᴏᴛ ғᴀsᴛ ʀᴇsᴘᴏɴ
✨ᴋᴜᴏᴛᴀ + ᴍᴇᴍᴏʀɪ ᴛɪᴅᴀᴋ ᴄᴇᴘᴀᴛ ʙᴏʀᴏs

*Kegunaan Panel BOT:*
_- Bot Online 24/7 (Jika tidak ada eror dalam scriptnya)_
_- Hemat Kuota_
_- Bot Anti Delay_
_- Hemat Penyimpanan_
_- Gak Ribet Buat Run Bot_
_- Bot Fast Respon_
_- Masih banyak lagi_

*NO ADMIN*
ADMIN : 6285338482575 
A/N : ARI SETIAWAN`
ramz.sendMessage(from, {text: tek}, {quoted: fkontak})
}
break
case 'flex':{
let tev =`JUAL TEMBAK PAKET XL

Xtra Combo Flex s : Rp 18.000

Xtra Combo Flex s+: Rp 30.000

Xtra Combo Flex M: Rp 42.000

Xtra Combo Flex L : Rp 59.000

Xtra Combo Flex XL: Rp 84.000

Xtra Combo Flex XXL: Rp 114.000

=====================================
☎️MINAT ?? HUBUNGI : 
✅WhatsApp : wa.me/+6281327393959 
✅Telegram   : https://t.me/ARI_VPN_STORE
✅Testimoni  : t.me/RAJA_VPN_STORE
✅100% Amanah🙏
✅SUDAH TERPERCAYA 😉`
ramz.sendMessage(from, {text: tev}, {quoted: fkontak})
}
break
case 'ytprem':{
let tev =`
REDY YT PREM 

*NO GARANSI*

® 4 BULAN EMAIL SELLER : Rp 10.000
® 4 BULAN EMAIL BUYER : Rp 7.000
® 6 BULAN EMAIL BUYER : Rp 12.000
≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠

_*S & K EMAIL BUYYER :*_
1. wajib email fresh (dalam arti email baru / umur blm ada 1bulan)
2. tidak terkena verif / v2l (jika terkena maka akan dikonfirmasi seller untuk ganti gmail 3x, 3x masi verif dana hangus)
3. setelah transfer hanya diberi waktu drop / kirim email pw ke seller dalam maximal 1 jam (jika 1 jam tidak ada respon drop email maka dana hangus)
`
ramz.sendMessage(from, {text: tev}, {quoted: fkontak})
}
// PERINTAH ADMIN
case 'p':
case 'proses':{
let tep = (`「 *AKUN SEDANG DI BUAT* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Pending\`\`\`\n\n*--------------------------*\n\n*Pesanan ini akan diproses manual oleh admin,* *Tunggu admin memprosesnya🙏*\n*Atau Chat : wa.me//${setting.kontakOwner}*`)
ramz.sendMessage(from, {text: tep}, {quoted: fkontak})
}
break
case 'd':
case 'done':{
let ted = (`「 *AKUN BERHASIL DI BUAT* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Berhasil\`\`\`\n\_Terima kasih atas bisnis Anda. Kami harap dapat bekerja sama lagi dengan Anda._\n*Thank you for your order😉👍*`)
ramz.sendMessage(from, {text: ted}, {quoted: fkontak})
}
break
case 'tambah':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one + nilai_two}`)
break
case 'kurang':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one - nilai_two}`)
break
case 'kali':
if (!q) return reply(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one * nilai_two}`)
break
case 'bagi':
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
var num_one = q.split(' ')[0]
var num_two = q.split(' ')[1]
if (!num_one) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
if (!num_two) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 1 2`)
var nilai_one = Number(num_one)
var nilai_two = Number(num_two)
reply(`${nilai_one / nilai_two}`)
break
case 'hidetag':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
ramz.sendMessage(from, { text: q ? q : '', mentions: mem })
break
case 'antilink':{
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!args[0]) return reply(`Kirim perintah #${command} _options_\nOptions : on & off\nContoh : #${command} on`)
if (args[0] == 'ON' || args[0] == 'on' || args[0] == 'On') {
if (isAntiLink) return reply('Antilink sudah aktif')
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Activate Antilink In This Group')
} else if (args[0] == 'OFF' || args[0] == 'OF' || args[0] == 'Of' || args[0] == 'Off' || args[0] == 'of' || args[0] == 'off') {
if (!isAntiLink) return reply('Antilink belum aktif')
let anu = antilink.indexOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfully Disabling Antilink In This Group')
} else { reply('Kata kunci tidak ditemukan!') }
}
break
case 'group':
case 'grup':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
if (args[0] == "close") {
ramz.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
} else if (args[0] == "open") {
ramz.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
} else {
reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
}
break
case 'kick':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
ramz.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else if (isQuotedMsg) {
number = quotedMsg.sender
ramz.groupParticipantsUpdate(from, [number], "remove")
.then( res => 
reply(`*Sukses mengeluarkan member..!*`))
.catch((err) => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
break
case 'block':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Block\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
reply('Sukses Block Nomor')
}
break
case 'unblock':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Ex : ${prefix+command} Nomor Yang Ingin Di Unblock\n\nContoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock")
reply('Sukses Unblock Nomor')
}
break
case 'addlist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n#${command} tes@apa`)
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
addResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
break
case 'dellist':{
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: `#hapuslist ${x.key}`
})
}
}
var listMsg = {
text: `Hai @${sender.split("@")[0]}`,
buttonText: 'pilih disini',
footer: 'Silahkan pilih list yg mau dihapus',
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
ramz.sendMessage(from, listMsg)
}
break
case 'sc':
case 'script':
case 'scbot':
case 'scriptbot':{
delResponList(from, q, db_respon_list)
reply(`━━━━━━━━━━━━━━━━━━━━━━
SECRIPT POTATO TUNNELING
━━━━━━━━━━━━━━━━━━━━━━
1 IP/Bulan : 15k
━━━━━━━━━━━━━━━━━━━━━━
Only - Debian 10 (Recommended)
         - Ubuntu 20.04
━━━━━━━━━━━━━━━━━━━━━━
📌 Fitur
1. Notif user login Bot Telegram
2. Bisa atur Limit ip per user 
3. Set Time Banned & Auto Kill
4. Support semua new metode
5. Multi Port tidak hanya 443/80
6. Bisa atur Bandwidth per user
7. Support Custom Multi Path
8. Support Tsel opok yang viral & Orbit opok
9. Speedtest
10. Ram Usage
11. Cek Bandwith
12. Change Timezone
13. Change Core

⚠️ Note ⚠️
Usahakan vps Support buat tunneling. Di luar itu resiko d tanggung sendiri
No refunds No Debat`)
}
break
case 'hapuslist':
delResponList(from, q, db_respon_list)
reply(`Sukses delete list message dengan key *${q}*`)
break
default:
if ((budy) && ["assalamu'alaikum", "Assalamu'alaikum", "Assalamualaikum", "assalamualaikum", "Assalammualaikum", "assalammualaikum", "Asalamualaikum", "asalamualaikum", "Asalamu'alaikum", " asalamu'alaikum"].includes(budy) && !isCmd) {
ramz.sendMessage(from, { text: `${pickRandom(["Wa'alaikumussalam","Wa'alaikumussalam Wb.","Wa'alaikumussalam Wr. Wb.","Wa'alaikumussalam Warahmatullahi Wabarakatuh"])}`})
}
if ((budy) && ["tes", "Tes", "TES", "Test", "test", "ping", "Ping"].includes(budy) && !isCmd) {
ramz.sendMessage(from, { text: `${runtime(process.uptime())}*⏰`})
}

}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const moment = require("moment-timezone");
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let kon_erorr = {"tanggal": tanggal, "jam": jam, "error": err, "user": sender}
db_error.push(kon_erorr)
fs.writeFileSync('./database/error.json', JSON.stringify(db_error))
var errny =`*SERVER ERROR*
*Dari:* @${sender.split("@")[0]}
*Jam:* ${jam}
*Tanggal:* ${tanggal}
*Tercatat:* ${db_error.length}
*Type:* ${err}`
ramz.sendMessage(setting.ownerNumber, {text:errny, mentions:[sender]})
}}