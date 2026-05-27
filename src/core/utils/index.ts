export async function delay(amount: number = 1500) {
  await new Promise((resolve) => setTimeout(resolve, amount))
}