export const up = async function (db: any): Promise<any> {
  await db.runSql(`
    INSERT INTO accents(locale_id, accent_name, accent_token)
    VALUES ((SELECT id FROM locales WHERE name = "sva"),"ლჷჟა̄ბუ, უშგულ","ushgul"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷჟა̄ბუ, კა̄ლ","kala"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷჟა̄ბუ, იფა̄̈რ","ipari"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷჟა̄ბუ, მესტია","mestia"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷჟა̄ბუ, ლენჯა̄̈რ","lenjeri"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷჟა̄ბუ, ლატლი","latali"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷჟა̄ბუ, და̈ლ","upperbaldali"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლუჩვაბურუ, ბეჩვი","becho"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლუჩვაბურუ, ცხჷმა̈რ","tskhumari"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლუჩვაბურუ, ჰეცერ","etseri"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლუჩვაბურუ, ფა̈რ","pari"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლუჩვაბურუ, ლახმჷლ","lakhamula"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლუჩვაბურუ, ჩვიბეჴევ","chubekhevi"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლუჩვაბურუ, და̈ლ","lowerbaldali"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷლა̄შხუ, ჟახუნდერ","zhakhunderi"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷლა̄შხუ, ჩიხარეშ","chikhareshi"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷლა̄შხუ, ცა̄ნ","tsana"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷლტეხუ, ლენტხა","lentekhi"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷლტეხუ, ჴელედ","kheledi"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷლტეხუ, ხოფურ","khopuri"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷლტეხუ, რცხმელურ","rtskhmeluri"),
      ((SELECT id FROM locales WHERE name = "sva"),"ლჷლტეხუ, ჩოლურ","choluri"),
  `)
};

export const down = async function (): Promise<any> {
  return null;
};
