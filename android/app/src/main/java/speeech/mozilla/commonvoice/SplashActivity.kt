package speeech.mozilla.commonvoice

import android.content.Intent
import android.opengl.Visibility
import android.os.Bundle
import android.os.Handler
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.view.animation.*
import kotlinx.android.synthetic.main.activity_splash.*

class SplashActivity : AppCompatActivity() {
    private var mDelayHandler: Handler? = null
    private val SPLASH_DELAY: Long = 3000 //3 seconds

    internal val mRunnable: Runnable = Runnable {
        if (!isFinishing) {
            val intent = Intent(applicationContext, MainActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    internal val mRunnableForIcons: Runnable = Runnable {
        if (!isFinishing) {


            /*val fadeIn = AlphaAnimation(0f, 1f)
            fadeIn.interpolator = DecelerateInterpolator() //add this
            fadeIn.duration = 1000

            val fadeOut = AlphaAnimation(1f, 0f)
            fadeOut.interpolator = AccelerateInterpolator() //and this
            fadeOut.startOffset = 1000
            fadeOut.duration = 1000

            val animation = AnimationSet(false) //change to false
            animation.addAnimation(fadeIn)
            animation.addAnimation(fadeOut)
            imgSpeech.setAnimation(animation)*/

            imgSpeech.visibility = View.VISIBLE
            imgListen.visibility = View.VISIBLE

            val animation = AnimationUtils.loadAnimation(applicationContext, R.anim.zoom)
            imgListen.startAnimation(animation)
            imgSpeech.startAnimation(animation)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        //Initialize the Handler
        mDelayHandler = Handler()

        //Navigate with delay
        mDelayHandler!!.postDelayed(mRunnable, SPLASH_DELAY)


        mDelayHandler!!.postDelayed(mRunnableForIcons, 1000)


    }

    public override fun onDestroy() {

        if (mDelayHandler != null) {
            mDelayHandler!!.removeCallbacks(mRunnable)
        }

        super.onDestroy()
    }

}