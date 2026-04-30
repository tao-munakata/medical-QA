import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('問診票の主要画面にWCAG重大違反がない', async ({ page }) => {
  await page.goto('/');

  const initialResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(initialResults.violations).toEqual([]);

  await page.getByLabel('氏名').fill('テスト太郎');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('spinbutton', { name: '必須 年齢 数字で入力する' }).fill('42');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('発熱').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('今日から').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('症状を具体的に教えてください').fill('昨日から発熱と喉の痛みがあります。');
  await page.getByRole('button', { name: '次へ' }).click();

  const midResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(midResults.violations).toEqual([]);
});

test('入力エラーは具体的に表示され、該当項目に留まる', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '次へ' }).click();

  await expect(page.getByRole('alert')).toHaveText('氏名を入力してください。');
  await expect(page.getByLabel('氏名')).toBeVisible();
});

test('回答は自動保存されリロード後も復元される', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('氏名').fill('テスト太郎');
  await expect(page.getByText(/自動保存済み/)).toBeVisible();

  await page.reload();
  await expect(page.getByLabel('氏名')).toHaveValue('テスト太郎');
});

test('数字欄は候補選択と直接入力の両方に対応する', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('氏名').fill('テスト太郎');
  await page.getByRole('button', { name: '次へ' }).click();

  await page.getByLabel('年齢を候補から選ぶ').selectOption('40');
  await expect(page.getByRole('spinbutton', { name: '必須 年齢 数字で入力する' })).toHaveValue('40');

  await page.getByRole('spinbutton', { name: '必須 年齢 数字で入力する' }).fill('41');
  await expect(page.getByRole('spinbutton', { name: '必須 年齢 数字で入力する' })).toHaveValue('41');
});

test('服薬なしの場合は薬の詳細入力をスキップする', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('氏名').fill('テスト太郎');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('spinbutton', { name: '必須 年齢 数字で入力する' }).fill('41');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('発熱').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('今日から').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('症状を具体的に教えてください').fill('昨日から発熱があります。');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('軽い').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('いない').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();

  await expect(page.getByText('薬局やお薬手帳で確認できますか？')).toBeVisible();
  await expect(page.getByLabel('薬の名前や量がわかれば入力してください')).toHaveCount(0);
});

test('最後に回答確認画面が表示される', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('氏名').fill('テスト太郎');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('spinbutton', { name: '必須 年齢 数字で入力する' }).fill('41');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('発熱').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('今日から').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('症状を具体的に教えてください').fill('昨日から発熱があります。');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('軽い').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('いない').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ない', { exact: true }).check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('できるだけ早く').check();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('個人情報の取り扱いと医師への共有に同意します').check();
  await page.getByRole('button', { name: '確認する' }).click();

  await expect(page.getByRole('heading', { name: '回答内容の確認' })).toBeVisible();
  await expect(page.getByText('テスト太郎')).toBeVisible();
  await expect(page.getByText('薬の名前や量がわかれば入力してください')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '完了する' })).toBeVisible();

  await page.locator('.answer-item').filter({ hasText: '氏名' }).getByRole('button', { name: '修正' }).click();
  await page.getByRole('textbox', { name: '必須 氏名' }).fill('テスト花子');
  await page.getByRole('button', { name: '確認に戻る' }).click();

  await expect(page.getByRole('heading', { name: '回答内容の確認' })).toBeVisible();
  await expect(page.getByText('テスト花子')).toBeVisible();
});
