
// const asyncHandler = "Santosh"
// const asyncHandler = () => {}
// const asyncHandler = (func) => {}
//const asyncHandler = (func) => () => {}
//const asyncHandler = (func) => async(req,res,next) => {}
// function gives output as req , res and next , that i am imputing to asyn function
// req is from frontend 
// res comming from server 
// next is middleware

const asyncHandler = (fn) => async(req,res,next) => {
        try {
            await fn(req,res,next)
        } catch (error) {
            res.status(erro.code || 500).json({
                success : false,
                message :error.message
            })
            
        }
}


export default asyncHandler;