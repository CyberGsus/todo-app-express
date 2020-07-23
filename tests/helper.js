const generateRandomId = () => {
  const data = []
  for (let i = 0; i < 12; i++) data.push(Math.floor(Math.random() * 255))
  return Buffer.from(data).toString('hex')
}

module.exports = { generateRandomId }

if (require.main === module) {
  console.log(generateRandomId())
}
