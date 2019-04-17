import _ from 'lodash';
import accountModel from '../models/accounts';
import tModel from '../models/transactions';


class transactionsCtrl {
  static async debit(req, res, next) {
    try {
      const cashier = req.user.id;
      const account = accountModel.findAccountByNo(req.params.accountNumber);
      if (!account) {
        return res.status(404).json({
          status: res.statusCode, error: 'Account does not exist'
        });
      }
      const oldBalance = account.balance;
      const amount = Number(req.body.amount);
      if (amount > oldBalance) {
        return res.status(400).json({
          status: res.statusCode,
          error: 'Balance not sufficient for debit transaction'
        });
      }
      const type = 'debit';
      const newBalance = await accountModel.debit(account.accountNumber, amount);
      return transactionsCtrl.response(oldBalance, amount, newBalance, account, cashier, res, type);
    } catch (err) {
      return next(err);
    }
  }


  static async credit(req, res, next) {
    try {
      const cashier = req.user.id;
      const account = accountModel.findAccountByNo(req.params.accountNumber);
      if (!account) {
        return res.status(404).json({
          status: res.statusCode, error: 'Account does not exist'
        });
      }

      const oldBalance = account.balance;
      const amount = Number(req.body.amount);
      const type = 'credit';
      const newBalance = await accountModel.credit(account.accountNumber, amount);
      return transactionsCtrl.response(oldBalance, amount, newBalance, account, cashier, res, type);
    } catch (err) {
      return next(err);
    }
  }

  static response(oldBalance, amount, newBalance, account, cashier, res, type) {
    const data = {
      type, oldBalance, amount, newBalance, accountNumber: account.accountNumber, cashier
    };
    const transactionDetail = tModel.create(data);
    return res.status(201).json({
      status: res.statusCode,
      data: {
        transactionId: transactionDetail.transactionId,
        accountNumber: transactionDetail.accountNumber,
        amount: transactionDetail.amount,
        cashier: transactionDetail.cashier,
        transactionType: transactionDetail.type,
        acccountBalance: transactionDetail.newBalance,
        date: transactionDetail.createdOn
      }
    });
  }

  static async getUserTransactions(req, res, next) {
    try {
      const userTransactions = await tModel.getUserTransactions(req.params.accountNumber);
      return res.status(200).json({
        status: res.statusCode,
        data: userTransactions
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getSingleTransaction(req, res, next) {
    try {
      const transation = tModel.findByID(req.params.transactionId);
      if (!transation) {
        return res.status(404).json({
          status: res.statusCode, error: 'Not Found'
        });
      }

      return res.status(200).json({
        status: res.statusCode,
        data: _.omit(transation, ['cashier'])
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default transactionsCtrl;
