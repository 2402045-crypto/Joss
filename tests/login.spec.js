const { test, expect } = require('@playwright/test');

test('Login correcto', async ({ page }) => {

  await page.goto('http://localhost:5173/login');

  await page.getByTestId('email').fill('vina_mora@gmail.com');
  await page.getByTestId('password').fill('Dokka28');

  await page.getByTestId('login-btn').click();

  await expect(
    page.locator('text=¡Bienvenido a MecanicWeb!')
  ).toBeVisible();

  await page.waitForURL('**/home');

});

test('Login incorrecto', async ({ page }) => {

  await page.goto('http://localhost:5173/login');

  await page.getByTestId('email').fill('correo@correo.com');
  await page.getByTestId('password').fill('123456');

  const dialogPromise = page.waitForEvent('dialog');

  await page.getByTestId('login-btn').click();

  const dialog = await dialogPromise;

  expect(dialog.message()).toContain('Error');

  await dialog.accept();

});

test('CP-03 Registro de usuario', async ({ page }) => {

  const email = `juan${Date.now()}@gmail.com`;

  await page.goto('http://localhost:5173/register');

  await page.getByTestId('usuario').click();

  await page.getByTestId('fullName').fill('Juan Pérez');
  await page.getByTestId('email').fill(email);
  await page.getByTestId('phone').fill('5512345678');
  await page.getByTestId('password').fill('Password123');

  await page.getByTestId('submit').click();

  await expect(
    page.locator('text=Cuenta creada con éxito')
  ).toBeVisible();

});

test('CP-04 Registro de mecánico', async ({ page }) => {

  const email = `mecanico${Date.now()}@gmail.com`;

  await page.goto('http://localhost:5173/register');

  await page.getByTestId('mecanico').click();

  await page.getByTestId('fullName').fill('Pedro Mecánico');
  await page.getByTestId('email').fill(email);
  await page.getByTestId('phone').fill('5512345678');
  await page.getByTestId('password').fill('Password123');

  await page.getByTestId('experience').fill('5');
  await page.getByTestId('estado').selectOption('activo');

  await page.getByTestId('descripcionServicio').fill(
    'Especialista en motores y transmisiones.'
  );

  await page.getByTestId('submit').click();

  await expect(
    page.locator('text=Cuenta creada con éxito')
  ).toBeVisible();

});