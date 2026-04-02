// კოდერი — სასწავლო მასალების მოკ მონაცემები
// ჩალაგებული სტრუქტურა: კურსი > ლექცია > მასალა
// კონტენტი Markdown ფორმატით, YouTube და ბმულების მხარდაჭერით

import { Course } from '../../shared/types';

export const mockCourses: Course[] = [
  {
    id: 'frontend',
    title: 'ფრონტ-ენდი',
    icon: 'frontend',
    lectures: [
      {
        id: 'html',
        title: 'ლექცია 1 — HTML',
        materials: [
          {
            id: 'html-intro',
            title: 'რა არის HTML?',
            links: [
              { title: 'MDN — HTML შესავალი', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML' },
            ],
            content: `# რა არის HTML?

HTML (HyperText Markup Language) არის ვებგვერდების შექმნის ენა. ის განსაზღვრავს გვერდის **სტრუქტურას**.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/UB1O30fR-EE" frameborder="0" allowfullscreen></iframe>

## პირველი HTML ფაილი

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>ჩემი გვერდი</title>
  </head>
  <body>
    <h1>გამარჯობა, მსოფლიო!</h1>
    <p>ეს ჩემი პირველი ვებგვერდია.</p>
  </body>
</html>
\`\`\`

> **შენიშვნა:** ყველა HTML ფაილი იწყება \`<!DOCTYPE html>\` დეკლარაციით.`,
          },
          {
            id: 'html-tags',
            title: 'ძირითადი ტეგები',
            links: [
              { title: 'W3Schools HTML Tags', url: 'https://www.w3schools.com/tags/' },
            ],
            content: `# ძირითადი HTML ტეგები

## ტექსტის ტეგები

| ტეგი | აღწერა |
|------|--------|
| \`<h1>\` ... \`<h6>\` | სათაურები (h1 ყველაზე დიდი) |
| \`<p>\` | პარაგრაფი |
| \`<strong>\` | **თამამი** ტექსტი |
| \`<em>\` | *დახრილი* ტექსტი |
| \`<br>\` | ახალი ხაზი |

## ბმულები და სურათები

\`\`\`html
<a href="https://google.com">გადასვლა Google-ზე</a>
<img src="photo.jpg" alt="ჩემი ფოტო" width="300">
\`\`\`

## სიები

\`\`\`html
<!-- ბულეტებიანი სია -->
<ul>
  <li>ვაშლი</li>
  <li>მსხალი</li>
</ul>

<!-- დანომრილი სია -->
<ol>
  <li>პირველი ნაბიჯი</li>
  <li>მეორე ნაბიჯი</li>
</ol>
\`\`\`

## დავალება

შექმენი HTML ფაილი, რომელშიც იქნება:
1. შენი სახელი \`<h1>\` ტეგში
2. მოკლე აღწერა \`<p>\` ტეგში
3. სამ საგნიანი სია \`<ul>\` ტეგით`,
          },
          {
            id: 'html-attributes',
            title: 'ატრიბუტები და ფორმები',
            content: `# ატრიბუტები და ფორმები

## ატრიბუტები

HTML ტეგებს შეიძლება ჰქონდეთ **ატრიბუტები** — დამატებითი ინფორმაცია:

\`\`\`html
<a href="https://google.com" target="_blank">ახალ ტაბში</a>
<img src="photo.jpg" alt="აღწერა" width="300">
<div class="container" id="main">კონტენტი</div>
\`\`\`

## ფორმები

\`\`\`html
<form>
  <label>სახელი:</label>
  <input type="text" placeholder="ჩაწერე სახელი...">

  <label>პაროლი:</label>
  <input type="password">

  <button type="submit">გაგზავნა</button>
</form>
\`\`\`

### Input ტიპები

| ტიპი | აღწერა |
|------|--------|
| \`text\` | ტექსტური ველი |
| \`password\` | პაროლი (დაფარული) |
| \`number\` | რიცხვი |
| \`email\` | ელ. ფოსტა |
| \`checkbox\` | ჩამრთველი |
| \`radio\` | ერთის არჩევა |

## დავალება

შექმენი რეგისტრაციის ფორმა: სახელი, ელ. ფოსტა, პაროლი, და გაგზავნის ღილაკი.`,
          },
        ],
      },
      {
        id: 'css',
        title: 'ლექცია 2 — CSS',
        materials: [
          {
            id: 'css-intro',
            title: 'CSS შესავალი',
            links: [
              { title: 'MDN — CSS პირველი ნაბიჯები', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps' },
              { title: 'CSS-Tricks', url: 'https://css-tricks.com/' },
            ],
            content: `# CSS — შესავალი

CSS (Cascading Style Sheets) განსაზღვრავს ვებგვერდის **გარეგნულ იერს**.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/1PnVor36_40" frameborder="0" allowfullscreen></iframe>

## CSS-ის დაკავშირება

\`\`\`html
<link rel="stylesheet" href="style.css">
\`\`\`

## ძირითადი თვისებები

\`\`\`css
body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

h1 {
  color: blue;
  font-size: 32px;
  text-align: center;
}
\`\`\`

| თვისება | აღწერა |
|---------|--------|
| \`color\` | ტექსტის ფერი |
| \`background-color\` | ფონის ფერი |
| \`font-size\` | შრიფტის ზომა |
| \`margin\` | გარე დაშორება |
| \`padding\` | შიდა დაშორება |
| \`border\` | ჩარჩო |
| \`border-radius\` | მომრგვალება |`,
          },
          {
            id: 'css-selectors',
            title: 'სელექტორები',
            content: `# CSS სელექტორები

სელექტორი განსაზღვრავს **რომელ ელემენტს** მიენიჭება სტილი.

## სელექტორების ტიპები

\`\`\`css
/* ტეგის სელექტორი */
h1 { color: red; }

/* კლასის სელექტორი */
.highlight { background: yellow; }

/* ID სელექტორი */
#header { font-size: 24px; }

/* ჩალაგებული სელექტორი */
.card p { color: gray; }

/* ფსევდო-კლასი */
a:hover { color: blue; }
button:active { background: darkblue; }
\`\`\`

> **რჩევა:** ყოველთვის გამოიყენე კლასები (\`.class\`) ID-ს (\`#id\`) ნაცვლად — ეს უკეთესი პრაქტიკაა.

## დავალება

1. შექმენი 3 \`<div>\` სხვადასხვა კლასით
2. თითოეულს მიანიჭე განსხვავებული ფონის ფერი
3. **ბონუსი:** დაამატე \`:hover\` ეფექტი`,
          },
          {
            id: 'css-flexbox',
            title: 'Flexbox განლაგება',
            content: `# Flexbox

Flexbox არის CSS-ის ინსტრუმენტი ელემენტების **განლაგებისთვის**.

## ძირითადი კონცეფცია

\`\`\`css
.container {
  display: flex;
  justify-content: center;  /* ჰორიზონტალური */
  align-items: center;       /* ვერტიკალური */
  gap: 16px;                 /* დაშორება */
}
\`\`\`

## justify-content

| მნიშვნელობა | აღწერა |
|-------------|--------|
| \`flex-start\` | მარცხნიდან |
| \`center\` | ცენტრში |
| \`flex-end\` | მარჯვნიდან |
| \`space-between\` | თანაბარი დაშორებით |
| \`space-around\` | ირგვლივ დაშორებით |

## flex-direction

\`\`\`css
.row { flex-direction: row; }       /* ჰორიზონტალური */
.column { flex-direction: column; }  /* ვერტიკალური */
\`\`\`

## პრაქტიკული მაგალითი

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #333;
  color: white;
}
\`\`\`

## დავალება

გააკეთე **ნავიგაციის ბარი** flexbox-ით: ლოგო მარცხნივ, ლინკები მარჯვნივ.`,
          },
        ],
      },
      {
        id: 'javascript',
        title: 'ლექცია 3 — JavaScript',
        materials: [
          {
            id: 'js-intro',
            title: 'JavaScript შესავალი',
            links: [
              { title: 'MDN — JavaScript გზამკვლევი', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
              { title: 'JavaScript.info', url: 'https://javascript.info/' },
            ],
            content: `# JavaScript — შესავალი

JavaScript არის პროგრამირების ენა, რომელიც ვებგვერდს **ინტერაქტიულს** ხდის.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/W6NZfCO5SIk" frameborder="0" allowfullscreen></iframe>

## ცვლადები

\`\`\`javascript
let name = "ლაშა";
const age = 10;
let isStudent = true;

console.log("გამარჯობა, " + name);
\`\`\`

### let vs const

- \`let\` — მნიშვნელობა **შეიძლება შეიცვალოს**
- \`const\` — მნიშვნელობა **ვერ შეიცვლება**

## ფუნქციები

\`\`\`javascript
function greet(name) {
  alert("გამარჯობა, " + name + "!");
}

greet("ნინო");
\`\`\``,
          },
          {
            id: 'js-dom',
            title: 'DOM მანიპულაცია',
            content: `# DOM მანიპულაცია

DOM (Document Object Model) საშუალებას გაძლევს **JavaScript-ით შეცვალო** ვებგვერდი.

## ელემენტის მოძებნა

\`\`\`javascript
let title = document.querySelector("h1");
let btn = document.getElementById("myBtn");
let items = document.querySelectorAll(".item");
\`\`\`

## კონტენტის შეცვლა

\`\`\`javascript
title.textContent = "ახალი სათაური";
title.style.color = "red";
title.classList.add("active");
\`\`\`

## მოვლენები (Events)

\`\`\`javascript
let button = document.querySelector("button");

button.addEventListener("click", function() {
  alert("ღილაკს დააჭირე!");
});
\`\`\`

### ხშირი მოვლენები

| მოვლენა | როდის ხდება |
|---------|------------|
| \`click\` | დაჭერისას |
| \`mouseover\` | მაუსის გადატარებისას |
| \`keydown\` | კლავიშის დაჭერისას |
| \`submit\` | ფორმის გაგზავნისას |

## დავალება

1. შექმენი ღილაკი და \`<p>\` ელემენტი
2. ღილაკზე დაჭერისას შეცვალე \`<p>\`-ის ტექსტი
3. **ბონუსი:** ყოველ დაჭერაზე შეცვალე ფერი`,
          },
        ],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    icon: 'python',
    lectures: [
      {
        id: 'py-basics',
        title: 'ლექცია 1 — საფუძვლები',
        materials: [
          {
            id: 'py-intro',
            title: 'Python-ის შესავალი',
            links: [
              { title: 'Python ოფიციალური ტუტორიალი', url: 'https://docs.python.org/3/tutorial/' },
              { title: 'W3Schools Python', url: 'https://www.w3schools.com/python/' },
            ],
            content: `# Python — შესავალი

Python არის ერთ-ერთი ყველაზე პოპულარული პროგრამირების ენა. ის მარტივია და იკითხება როგორც ინგლისური.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/kqtD5dpn9C8" frameborder="0" allowfullscreen></iframe>

## ცვლადები და ტიპები

\`\`\`python
name = "გიორგი"
age = 11
height = 1.45
is_student = True
\`\`\`

| ტიპი | აღწერა | მაგალითი |
|------|--------|---------|
| \`str\` | ტექსტი | \`"გამარჯობა"\` |
| \`int\` | მთელი რიცხვი | \`42\` |
| \`float\` | ათწილადი | \`3.14\` |
| \`bool\` | ლოგიკური | \`True\` / \`False\` |

## გამოტანა და შეტანა

\`\`\`python
print(f"სახელი: {name}, ასაკი: {age}")

name = input("რა გქვია? ")
print("გამარჯობა, " + name)
\`\`\`

> **რჩევა:** \`f-string\` ყველაზე მოსახერხებელი გზაა ცვლადების ტექსტში ჩასასმელად.`,
          },
          {
            id: 'py-operators',
            title: 'ოპერატორები',
            content: `# ოპერატორები

## არითმეტიკული ოპერატორები

| ოპერატორი | აღწერა | მაგალითი |
|-----------|--------|---------|
| \`+\` | შეკრება | \`5 + 3 = 8\` |
| \`-\` | გამოკლება | \`5 - 3 = 2\` |
| \`*\` | გამრავლება | \`5 * 3 = 15\` |
| \`/\` | გაყოფა | \`5 / 2 = 2.5\` |
| \`//\` | მთელი გაყოფა | \`5 // 2 = 2\` |
| \`%\` | ნაშთი | \`5 % 2 = 1\` |
| \`**\` | ხარისხი | \`2 ** 3 = 8\` |

## პრაქტიკული მაგალითი

\`\`\`python
a = int(input("პირველი რიცხვი: "))
b = int(input("მეორე რიცხვი: "))

print(f"ჯამი: {a + b}")
print(f"სხვაობა: {a - b}")
print(f"ნამრავლი: {a * b}")
\`\`\`

## დავალება

დაწერე **კალკულატორი**: მომხმარებელი შეიყვანს ორ რიცხვს და პროგრამა გამოიტანს ჯამს, სხვაობას, ნამრავლს და განაყოფს.`,
          },
        ],
      },
      {
        id: 'py-control',
        title: 'ლექცია 2 — პირობები და ციკლები',
        materials: [
          {
            id: 'py-conditions',
            title: 'პირობითი ოპერატორები',
            links: [
              { title: 'Python — Control Flow', url: 'https://docs.python.org/3/tutorial/controlflow.html' },
            ],
            content: `# პირობითი ოპერატორები

## if / elif / else

\`\`\`python
age = int(input("რამდენი წლის ხარ? "))

if age < 10:
    print("შენ პატარა ხარ!")
elif age < 18:
    print("შენ მოზარდი ხარ!")
else:
    print("შენ ზრდასრული ხარ!")
\`\`\`

## შედარების ოპერატორები

| ოპერატორი | მნიშვნელობა |
|-----------|-------------|
| \`==\` | ტოლია |
| \`!=\` | არ არის ტოლი |
| \`<\` / \`>\` | ნაკლებია / მეტია |
| \`<=\` / \`>=\` | ნაკლები ან ტოლი / მეტი ან ტოლი |

## ლოგიკური ოპერატორები

\`\`\`python
if age >= 10 and has_ticket:
    print("შეგიძლია შეხვიდე!")
\`\`\`

- \`and\` — ორივე True
- \`or\` — ერთ-ერთი True
- \`not\` — უარყოფა

## დავალება

დაწერე ქულის შეფასების პროგრამა (0-100): "ფრიადი", "კარგი", "საშუალო", "ჩაჭრილი".`,
          },
          {
            id: 'py-loops',
            title: 'ციკლები',
            links: [
              { title: 'Real Python — Loops', url: 'https://realpython.com/python-for-loop/' },
            ],
            content: `# ციკლები

## for ციკლი

\`\`\`python
for i in range(1, 6):
    print(i)

fruits = ["ვაშლი", "მსხალი", "ბანანი"]
for fruit in fruits:
    print(fruit)
\`\`\`

### range()

| გამოძახება | შედეგი |
|-----------|--------|
| \`range(5)\` | 0, 1, 2, 3, 4 |
| \`range(1, 6)\` | 1, 2, 3, 4, 5 |
| \`range(0, 10, 2)\` | 0, 2, 4, 6, 8 |

## while ციკლი

\`\`\`python
count = 0
while count < 5:
    print("ჯერი:", count)
    count += 1
\`\`\`

> **გაფრთხილება:** while ციკლში აუცილებლად უნდა შეიცვალოს პირობა!

## break და continue

\`\`\`python
for i in range(10):
    if i == 5:
        break      # ციკლის გაჩერება
    print(i)

for i in range(10):
    if i % 2 == 0:
        continue   # გამოტოვება
    print(i)       # მხოლოდ კენტი
\`\`\`

## დავალება

დაწერე გამრავლების ტაბულა 1-დან 10-მდე. **ბონუსი:** მომხმარებელმა თავად აირჩიოს რიცხვი.`,
          },
        ],
      },
      {
        id: 'py-data',
        title: 'ლექცია 3 — მონაცემთა სტრუქტურები',
        materials: [
          {
            id: 'py-lists',
            title: 'სიები (Lists)',
            content: `# სიები (Lists)

სია არის მონაცემების **მოწესრიგებული კოლექცია**.

## სიის შექმნა

\`\`\`python
fruits = ["ვაშლი", "მსხალი", "ბანანი"]
numbers = [1, 2, 3, 4, 5]
mixed = ["ტექსტი", 42, True]
\`\`\`

## ელემენტებზე წვდომა

\`\`\`python
print(fruits[0])    # "ვაშლი" (პირველი)
print(fruits[-1])   # "ბანანი" (ბოლო)
print(fruits[1:3])  # ["მსხალი", "ბანანი"]
\`\`\`

## სიის მეთოდები

| მეთოდი | აღწერა |
|--------|--------|
| \`.append(x)\` | ელემენტის დამატება ბოლოში |
| \`.insert(i, x)\` | ელემენტის ჩასმა პოზიციაზე |
| \`.remove(x)\` | ელემენტის წაშლა |
| \`.pop()\` | ბოლო ელემენტის ამოღება |
| \`.sort()\` | დალაგება |
| \`len(list)\` | სიის სიგრძე |

\`\`\`python
fruits.append("ატამი")
fruits.remove("მსხალი")
print(len(fruits))
\`\`\`

## დავალება

შექმენი სია 5 საგნით. დაბეჭდე ყველა, შემდეგ დაამატე ახალი და წაშალე ერთი.`,
          },
          {
            id: 'py-dicts',
            title: 'ლექსიკონები (Dictionaries)',
            content: `# ლექსიკონები (Dictionaries)

ლექსიკონი ინახავს მონაცემებს **გასაღები: მნიშვნელობა** წყვილებით.

## ლექსიკონის შექმნა

\`\`\`python
student = {
    "name": "გიორგი",
    "age": 11,
    "grade": "5ა"
}
\`\`\`

## წვდომა და შეცვლა

\`\`\`python
print(student["name"])       # "გიორგი"
student["age"] = 12          # შეცვლა
student["school"] = "კოდერი" # ახლის დამატება
\`\`\`

## გავლა ციკლით

\`\`\`python
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

## დავალება

შექმენი ლექსიკონი 3 მეგობრის მონაცემებით (სახელი, ასაკი). ციკლით გამოიტანე ყველა.`,
          },
        ],
      },
    ],
  },
];
