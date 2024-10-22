const User = require('../models/userModel'); // User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path')
const fs = require('fs')
const { upload } = require('../helpers/helper');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            message: "Login Successfull!",
            ...user.toObject(),
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


exports.updateprofile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading file', error: err });
        }
        const { name, phone, bio } = req.body;
        const userId = req.user.userId;
        let imagePath;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (req.file) {
                if (user.image) {
                    const oldImagePath = path.join(__dirname, '../public/uploads/', user.image);
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error removing old image:', unlinkErr);
                        }
                        console.log('removed old image..')
                    });
                }
                imagePath = req.file.filename;
            } else {
                imagePath = user.image;
            }

            user.name = name || user.name;
            user.phone = phone || user.phone;
            user.bio = bio || user.bio;
            user.image = imagePath;
            await user.save();
            res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    bio: user.bio,
                    image: user.image,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });
}


exports.addExperience = async (req, res) => {
    const userId = req.user.userId;
    const { title, company, startDate, endDate, description } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.experience.push({ title, company, startDate, endDate, description });
        await user.save();

        res.status(201).json({ message: 'Experience added successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateExperience = async (req, res) => {
    const userId = req.user.userId;
    const { experienceId, title, company, startDate, endDate, description } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const experience = user.experience.id(experienceId);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        experience.title = title || experience.title;
        experience.company = company || experience.company;
        experience.startDate = startDate || experience.startDate;
        experience.endDate = endDate || experience.endDate;
        experience.description = description || experience.description;

        await user.save();

        res.status(200).json({ message: 'Experience updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeExperience = async (req, res) => {
    const userId = req.user.userId;
    const { experienceId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const experience = user.experience.id(experienceId);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        experience.remove();
        await user.save();

        res.status(200).json({ message: 'Experience removed successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.addProject = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading file', error: err });
        }
        const userId = req.user.userId;

        const { year, projectName, madeAt, technology, projectUrl } = req.body;
        let imagePath;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (req.file) {
                imagePath = req.file.filename;
            }

            const newProject = {
                year,
                image: imagePath,
                name: projectName,
                madeAt,
                technology: JSON.parse(technology),
                projectUrl,
            };
            
            user.projects.push(newProject);
            await user.save();

            res.status(201).json({ message: 'Project added successfully', user });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    })
};

exports.getProjectList = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId).select('projects');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateProject = async (req, res) => {
    const userId = req.user.userId;
    const { projectId, title, description, link } = req.body;

    console.log(req.body, '=====project')

    // {
    //     year: '1977',
    //     image: {},
    //     projectName: 'Isadora Bowman',
    //     madeAt: 'Ipsum earum quam es',
    //     technology: '["Node","React","Angular","MongoDb"]',
    //     projectUrl: 'https://www.bikawuzikekewif.mobi'
    //   }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const project = user.projects.id(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.title = title || project.title;
        project.description = description || project.description;
        project.link = link || project.link;

        await user.save();

        res.status(200).json({ message: 'Project updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.removeProject = async (req, res) => {
    const userId = req.user.userId;
    const { projectId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const project = user.projects.id(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.remove();
        await user.save();

        res.status(200).json({ message: 'Project removed successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};





// exports.createUser = async () => {
//     const hashedPassword = await bcrypt.hash('jatin8117', 10);
//     const user = new User({
//         name: 'Jatinder Kumar',
//         email: 'kumarj597@gmail.com',
//         phone: '7837958117',
//         password: hashedPassword
//     });
//     await user.save();
// };





exports.amount_withdraw = () => {

}