import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export default {
  async encryptPassword(password) {
    const pass = await bcrypt.hash(password, 8);
    return pass;
  },

  //   async verifyPassword(plainText, hashedText) {
  //     const isMatch = await bcrypt.compare(plainText, hashedText);
  //     return isMatch;
  //   },

  // async randomIntInc(low, high) {
  //   return Math.floor(Math.random() * (high - low + 1) + low);
  // },

  // async generateCode(num) {
  //   let randomNum = "";
  //   // eslint-disable-next-line no-plusplus
  //   for (let i = 0; i < num; i++) {
  //     // eslint-disable-next-line no-await-in-loop
  //     randomNum += await this.randomIntInc(1, 10);
  //   }
  //   return randomNum;
  // },

  generateToken(data) {
    const token = jwt.sign({ data }, process.env.SECRET, { expiresIn: '30d' });
    return token;
  },
};
