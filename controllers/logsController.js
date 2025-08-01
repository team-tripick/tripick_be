const Logs = require('../models/Logs');

const getAllLogs = async (req, res, next) => {
  try {
    const logs = await Logs.find().sort({ createdAt: -1 });

    return res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

const getDetailLogs = async (req, res, next) => {
  const { logId } = req.params;
  try {
    const log = await Logs.findById(logId);
    if (!log) {
      return res
        .status(400)
        .json({ message: '해당 여행 일지가 존재하지 않습니다.' });
    }
    return res.status(200).json(log);
  } catch (error) {
    next(error);
  }
};

const postWriteLogs = async (req, res, next) => {
  try {
    const { title, log, date, planId } = req.body;

    if (!title || !log || !date?.startDate || !date?.endDate || !planId) {
      return res.status(400).json({ message: '필수 값을 모두 입력해주세요.' });
    }

    await Logs.create({
      title,
      log,
      startDate: date.startDate,
      endDate: date.endDate,
      planId,
    });

    return res.status(201).json({ message: '일지 작성이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

const patchEditLogs = async (req, res, next) => {
  const { logId } = req.params;
  const { title, log, date } = req.body;

  try {
    const updated = await Logs.findByIdAndUpdate(
      logId,
      {
        title,
        log,
        startDate: date.startDate,
        endDate: date.endDate,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: '수정할 일지가 없습니다.' });
    }

    return res.status(201).json({ message: '일지 수정이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

const delDetailLogs = async (req, res, next) => {
  const { logId } = req.params;

  try {
    const deleted = await Logs.findByIdAndDelete(logId);

    if (!deleted) {
      return res.status(404).json({ message: '삭제할 일지가 없습니다.' });
    }

    return res.status(200).json({ message: '삭제가 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLogs,
  getDetailLogs,
  postWriteLogs,
  patchEditLogs,
  delDetailLogs,
};
