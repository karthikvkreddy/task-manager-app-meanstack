require('../src/db/mongoose');

const User = require('../src/models/user');

// 640da03b8456a8532e8c2db9

// promise chaning
User.findByIdAndUpdate('640da03b8456a8532e8c2db9', {age:0}).then((user) => {
    console.log(user);
    return User.countDocuments({age: 0});
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})


// using async and await
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndDelete(id, { age: age});
    const count = await User.countDocuments({age});
    return count
}

updateAgeAndCount('640d972e98023974d9efb5c2', 0).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
});

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(_id);
    const count = await Task.countDocuments({completed: false});
    return count;
};

deleteTaskAndCount('640d972e98023974d9efb5c2').then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})
