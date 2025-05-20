const { User } = require('../models');
const { CustomException } = require('../utils');
const bcrypt = require('bcrypt');

const deleteUser = async (request, response) => {
    const { _id } = request.params;

    try {
        const user = await User.findOne({ _id });

        if(request.userID === user._id.toString()) {
            await User.deleteOne({ _id });
            return response.send({
                error: false,
                message: 'Account successfully deleted!'
            });
        }

        throw CustomException('Invalid request!. Cannot delete other user accounts.', 403);
    }
    catch({message, status = 500}) {
        return response.status(status).send({
            error: true,
            message
        })
    }
}

const updateUser = async (request, response) => {
    try {
        const { username, description, phone, image } = request.body;
        
        const user = await User.findByIdAndUpdate(
            request.userID,
            {
                $set: {
                    username,
                    description,
                    phone,
                    image
                }
            },
            { new: true }
        ).select('-password');

        return response.status(200).send(user);
    } catch (error) {
        return response.status(500).send({
            error: true,
            message: error.message
        });
    }
};

const changePassword = async (request, response) => {
    try {
        const { oldPassword, newPassword } = request.body;
        const user = await User.findById(request.userID);

        const isCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isCorrect) {
            return response.status(400).json({
                error: true,
                message: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(request.userID, {
            $set: { password: hashedPassword }
        });

        return response.status(200).json({
            error: false,
            message: 'Password updated successfully'
        });
    } catch (error) {
        return response.status(500).json({
            error: true,
            message: error.message
        });
    }
};

module.exports = {
    deleteUser,
    updateUser,
    changePassword
}