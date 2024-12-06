import React from 'react'
import { Localized } from '@fluent/react'

import './get-involved.css'

export const GetInvolvedSection = () => {
  return (
    <section className="get-involved-section">
      <Localized id="get-involved-section-title">
        <h2 />
      </Localized>
      <div className="cards-container">
        <div className="card">
          <h3>Scripted Speech</h3>
          <div className="card-image"></div>
          <ul>
            <li>
              <a href="#">
                Read sentences <span>→</span>
              </a>
            </li>
            <li>
              <a href="#">
                Validate readings <span>→</span>
              </a>
            </li>
            <li>
              <a href="#">
                Contribute to text corpus <span>→</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="card">
          <h3>Spontaneous Speech</h3>
          <div className="card-image"></div>
          <ul>
            <li>
              <a href="#">
                Answer questions <span>→</span>
              </a>
            </li>
            <li>
              <a href="#">
                Transcribe answers <span>→</span>
              </a>
            </li>
            <li>
              <a href="#">
                Review transcriptions <span>→</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="card">
          <h3>Language Text</h3>
          <div className="card-image"></div>
          <ul>
            <li>
              <a href="#">
                Contribute text <span>→</span>
              </a>
            </li>
            <li>
              <a href="#">
                Review transcriptions <span>→</span>
              </a>
            </li>
            <li>
              <a href="#">
                Press and Stories <span>→</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
