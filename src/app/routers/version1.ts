import express from 'express';
import adminRouter from '../modules/adminModule/admin.routes';
import categoryRouter from '../modules/categoryModule/category.routes';
import newsRouter from '../modules/newsModule/news.routes';
import newsCatRouter from '../modules/newsCategoryModule/newsCat.routes';
import subscriberRouter from '../modules/subscribeModule/subscriber.routes';
import adminAuthRouter from '../modules/adminAuthModule/auth.routes';
import partnerRouter from '../modules/partnerModule/partner.routes';
import certificateRoute from '../modules/certificateModule/certificate.routes';
import aboutUsRouter from '../modules/aboutUsModule/abountUs.routes';
import faqRouter from '../modules/faqModule/faq.routes';
import softwareRouter from '../modules/softwareModule/software.routes';
import screenRouter from '../modules/screenModule/screen.routes';
import contactUsRouter from '../modules/contactUsModule/contactUs.routes';
import heroRouter from '../modules/heroModule/hero.routes';
import productRouter from '../modules/productModule/product.routes';
import queryRouter from '../modules/queryModule/query.routes';
import conversationRouter from '../modules/conversationModule/conversation.routes';
import messageRouter from '../modules/messageModule/message.routes';
import attachmentRouter from '../modules/attachmentModule/attachment.routes';
import portfolioRoutes from '../modules/portfolioModule/portfolio.routes';

const routersVersionOne = express.Router();

// user
routersVersionOne.use('/admin', adminRouter);
routersVersionOne.use('/admin/auth', adminAuthRouter);

// application
routersVersionOne.use('/category', categoryRouter);
routersVersionOne.use('/news', newsRouter);
routersVersionOne.use('/newsCategory', newsCatRouter);
routersVersionOne.use('/subscriber', subscriberRouter);
routersVersionOne.use('/web-setting/partner', partnerRouter);
routersVersionOne.use('/web-setting/certificate', certificateRoute);
routersVersionOne.use('/web-setting/about-us', aboutUsRouter);
routersVersionOne.use('/web-setting/faq', faqRouter);
routersVersionOne.use('/web-setting/software', softwareRouter)
routersVersionOne.use('/web-setting/screen', screenRouter)
routersVersionOne.use('/web-setting/contact-us', contactUsRouter)
routersVersionOne.use('/web-setting/hero', heroRouter)
routersVersionOne.use('/web-setting/portfolio', portfolioRoutes)
routersVersionOne.use('/product', productRouter)
routersVersionOne.use('/query', queryRouter)
routersVersionOne.use('/conversation', conversationRouter)
routersVersionOne.use('/message', messageRouter)
routersVersionOne.use('/attachment', attachmentRouter)

// settings

export default routersVersionOne;
