<template>
  <div class="pd-page">
    <div class="container">
      <h1>Согласие на обработку персональных данных</h1>

      <p>
        Настоящим, используя данный сайт, вы подтверждаете своё согласие на
        обработку персональных данных в соответствии с Федеральным законом
        №152-ФЗ «О персональных данных» от 27 июля 2006 года.
      </p>

      <p>
        Под персональными данными понимается любая информация, относящаяся к
        прямо или косвенно определённому физическому лицу — пользователю сайта.
        К таким данным относятся: фамилия, имя, адрес электронной почты, номер
        телефона и иные сведения, предоставляемые пользователем при обращении.
      </p>

      <h2>Цель обработки персональных данных</h2>
      <p>Обработка данных осуществляется для следующих целей:</p>
      <ul>
        <li>обеспечение обратной связи с пользователем;</li>
        <li>информирование о продуктах и услугах, акциях и специальных предложениях;</li>
        <li>оформление заказов и подготовка коммерческих предложений;</li>
        <li>улучшение качества работы сайта и пользовательского опыта.</li>
      </ul>

      <h2>Порядок обработки и хранения</h2>
      <p>
        Персональные данные пользователей обрабатываются оператором с
        использованием средств автоматизации и/или без их использования, в
        соответствии с требованиями законодательства Российской Федерации.
      </p>
      <p>
        Передача персональных данных третьим лицам не осуществляется, за
        исключением случаев, прямо предусмотренных законом или необходимых для
        исполнения договорных обязательств.
      </p>

      <h2>Права пользователя</h2>
      <p>Пользователь имеет право:</p>
      <ul>
        <li>получать сведения об обработке своих персональных данных;</li>
        <li>требовать уточнения, блокировки или уничтожения своих данных, если они устарели или обрабатываются незаконно;</li>
        <li>
          отозвать согласие на обработку персональных данных, направив запрос на
          электронную почту
          <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>.
        </li>
      </ul>

      <h2>Оператор персональных данных</h2>
      <p>
        Обработка данных осуществляется индивидуальным предпринимателем:<br />
        ИНН: {{ contacts.inn }}<br />
        ОГРНИП: {{ contacts.ogrn }}<br />
        Email: <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a><br />
        Telegram: <a :href="contacts.telegramLink" target="_blank">@{{ contacts.telegram }}</a><br />
        ВКонтакте: <a :href="contacts.vk" target="_blank" rel="noopener">Группа во ВКонтакте</a>
      </p>

      <p class="final-note">
        Используя данный сайт, вы подтверждаете, что ознакомились с условиями
        настоящего соглашения и даёте согласие на обработку своих персональных данных.
      </p>
    </div>
  </div>
</template>

<script setup>
const contacts = {
  email: 'sitebypro@mail.ru',
  telegram: 'sitebypro',
  telegramLink: 'https://t.me/dozer_stoun',
  vk: 'https://vk.com/club233841249',
  inn: '302503086616',
  ogrn: '325300000026452'
}
</script>

<style scoped>
.pd-page {
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #0b1220;
  padding: 40px 20px;

}
.container {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  padding: 40px;
}
h1 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1f2937;
}
h2 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 28px;
  margin-bottom: 10px;
  color: #374151;
}
p {
  line-height: 1.6;
  margin-bottom: 14px;
  color: #374151;
}
ul {
  margin: 0 0 14px 20px;
  color: #374151;
}
li {
  margin-bottom: 6px;
}
a {
  color: #4f46e5;
  text-decoration: underline;
  transition: color 0.2s;
}
a:hover {
  color: #7c3aed;
}
.final-note {
  margin-top: 30px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  font-style: italic;
  color: #475569;
}
@media (max-width: 600px) {
  .container {
    padding: 24px;
  }
  h1 {
    font-size: 22px;
  }
}
</style>
