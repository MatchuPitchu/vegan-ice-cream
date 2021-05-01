import React from 'react';
import { IonNav } from '@ionic/react';

interface IonReactNavProps {
  detail: Function
}

const IonReactNav: React.FC<IonReactNavProps> = ({ children, detail }) => {

  const handleNavWillChange = async (navEl: HTMLIonNavElement) => {
    const rootView = await navEl.getByIndex(0)
    
    if (rootView === undefined) {
      const homeEl = navEl.querySelector('#home-wrapper') as HTMLDivElement
      const detailEl = navEl.querySelector('#detail-wrapper') as HTMLDivElement

      if (!homeEl || !detailEl) {
        throw new Error('Missing home or detail wrapper elements')
      }

      navEl.setRoot(homeEl)

      if (customElements.get('nav-detail') === undefined) {
        const detailNodes: ChildNode[] = []
        detailEl.childNodes.forEach(node => {
          detailNodes.push(node)
        })

        customElements.define('nav-detail', class NavDetail extends HTMLElement {
          connectedCallback() {
            this.append(...detailNodes)
          }
        })
      }

      navEl.querySelectorAll('.ion-react-nav-detail-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          navEl.push('nav-detail')
        })
      })
    }
  }


  return (
    <IonNav onIonNavWillChange={(e) => handleNavWillChange(e.target as HTMLIonNavElement)} root="nav-home">
      <div id="home-wrapper" >
        {children}
      </div>
      <div id="detail-wrapper" style={{ display: 'none' }}>
        {detail()}
      </div>
    </IonNav>
  )
}

export default IonReactNav