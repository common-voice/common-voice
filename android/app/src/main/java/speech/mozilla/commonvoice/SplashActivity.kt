package speech.mozilla.commonvoice

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.view.View
import android.view.animation.AnimationUtils
import kotlinx.android.synthetic.main.activity_splash.*

class SplashActivity : Activity() {
    private var mDelayHandler: Handler? = null
    private val splashDelay: Long = 2000 //3 seconds

    private val mRunnable: Runnable = Runnable {
        if (!isFinishing) {
            val intent = Intent(applicationContext, MainActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    private val mRunnableForIcons: Runnable = Runnable {
        if (!isFinishing) {
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
        mDelayHandler!!.postDelayed(mRunnable, splashDelay)

        // Speech and Listen Icon Animation
        mDelayHandler!!.postDelayed(mRunnableForIcons, 500)


    }

    public override fun onDestroy() {

        if (mDelayHandler != null) {
            mDelayHandler!!.removeCallbacks(mRunnable)
        }

        super.onDestroy()
    }

}