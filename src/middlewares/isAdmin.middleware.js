import User from '../db/models/users.model';
import Role from '../db/models/roles.model';

const checkIsAdminStatus = async (req, res, next) => {
  const { id } = req.data;
  try {
    const user = await User.findById(id);
    const roleId = user.role;
    const verify = await Role.findById(roleId);

    if (verify.name.toLowerCase() !== 'admin') {
      return res.status(401).json({
        status: '401 Unauthorized',
        error: 'User is not Admin',
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};

export default checkIsAdminStatus;
