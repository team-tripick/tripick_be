const Plans = require('../models/Plans');
const Logs = require('../models/Logs');

const getAllPlans = async (req, res, next) => {
  try {
    const plans = await Plans.find().sort({ createdAt: -1 });

    const formattedPlans = plans.map((plan) => ({
      id: plan._id,
      place: plan.place,
      plan: plan.plan,
      keyword: plan.keyword,
      createdAt: plan.createdAt
        ? plan.createdAt.toISOString().split('T')[0]
        : null,
      updatedAt: plan.updatedAt
        ? plan.updatedAt.toISOString().split('T')[0]
        : null,
    }));

    return res.status(200).json(formattedPlans);
  } catch (error) {
    next(error);
  }
};

const getDetailPlans = async (req, res, next) => {
  const { planId } = req.params;
  try {
    const plan = await Plans.findById(planId);
    if (!plan) {
      return res
        .status(400)
        .json({ message: '해당 여행 계획이 존재하지 않습니다.' });
    }

    // 관련 로그들 찾기
    const logs = await Logs.find({ planId: planId });

    const formattedLogs = logs.map((log) => ({
      ...log.toObject(),
      createdAt: log.createdAt
        ? log.createdAt.toISOString().split('T')[0]
        : null,
      updatedAt: log.updatedAt
        ? log.updatedAt.toISOString().split('T')[0]
        : null,
    }));

    const formattedPlan = {
      ...plan.toObject(),
      logs: formattedLogs,
    };

    return res.status(200).json(formattedPlan);
  } catch (error) {
    next(error);
  }
};

const postWritePlans = async (req, res, next) => {
  try {
    const { place, plan, keyword, date } = req.body;

    if (!place || !plan || !keyword || !date?.startDate || !date?.endDate) {
      return res.status(400).json({ message: '필수 값을 모두 입력해주세요.' });
    }

    await Plans.create({
      place,
      plan,
      keyword,
      startDate: date.startDate,
      endDate: date.endDate,
    });

    return res.status(201).json({ message: '계획 작성이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

const patchEditPlans = async (req, res, next) => {
  const { planId } = req.params;
  const { place, plan, keyword, date } = req.body;

  try {
    const updated = await Plans.findByIdAndUpdate(
      planId,
      {
        place,
        plan,
        keyword,
        startDate: date.startDate,
        endDate: date.endDate,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: '수정할 계획이 없습니다.' });
    }

    return res.status(201).json({ message: '계획 수정이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

const delDetailPlans = async (req, res, next) => {
  const { planId } = req.params;
  try {
    const deleted = await Plans.findByIdAndDelete(planId);
    if (!deleted) {
      return res.status(404).json({ message: '삭제할 계획이 없습니다.' });
    }
    return res.status(200).json({ message: '삭제가 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlans,
  getDetailPlans,
  postWritePlans,
  patchEditPlans,
  delDetailPlans,
};
