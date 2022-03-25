# 2022-winter-3-c
This is the work of team-3-c of the 2022 [jig.jp](https://www.jig.jp/) winter internship.

# Disaster Fundraising on the Web（災害募金Web）


**災害募金Web** is the appliction that enables disaster relief donations on the web.

It benefits the following people:
* **Municipalities** that cannot afford to purchase relief supplies due to financial constraints
* **Companies** that want to raise awareness by contributing to fundraising
* **Individuals** who simply want to make a donation

# DEMO

URL : https://jigintern-2022-winter-3-c.deno.dev/

<tr>
<td><img src=""></td>
<td><img src=""></td>
</tr>

The payment function is a trial version, so feel free to try it out.
Valid credit card information that can be entered in the trial version can be found at : 
https://stripe.com/docs/testing

I recommend entering the following:
```
NUMBER : 4242 4242 4242 4242
CVC : Any 3 digits
DATE : Any future date
```

# Features
It uses [Stripe](https://stripe.com/jp) for payment functions. Since Deno and Stripe are incompatible, the payment function is realized by redirecting from another web app using [Node.js](https://nodejs.org/ja/).

Click [here](https://github.com/Kitsuya0828/Stripe-Sample-App) for GitHub of the Node.js application that implements the payment function.

# Requirement
* Deno 1.19.3
* [supabase](https://app.supabase.io/)

# Installation
You can download Deno from : 
https://deno.land/

# Usage
```
git clone https://github.com/jigintern/2022-winter-3-c.git
cd 2022-winter-3-c
```
You can run it locally from the command prompt just using the command:

```
deno run --allow-run --allow-env --allow-net --allow-read server.ts
```
Before running it, you must sign up for [supabase](https://app.supabase.io/), prepare your database, and make the following changes to **server.ts**.
```
const databaseUrl = 'postgres://postgres:[YOUR-PASSWORD]@db.~~.supabase.co:6543/postgres';
```
[This site](https://jigintern.github.io/tutorial/pre-challenge/) is very helpful.

# Note
This is a trial version. Actual disaster fundraising has not begun.

# License
"Disaster Fundraising on the Web" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).

# Author
* Kitsuya Azuma



Thank you!