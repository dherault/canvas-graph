/* eslint-disable react/jsx-max-props-per-line */
import './index.css'

import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

function Legal() {
  return (
    <div className="h100vh overflow-auto Legal">
      <Container maxWidth="md" className="pt-12">
        <Paper className="p-4">
          <Typography variant="h4" className="mb-2">Privacy Policy</Typography>
          <Typography>Your privacy is important to us. It is Archipel's policy to respect your privacy regarding any information we may collect from you across our website, <Link href="https://archipel.app">https://archipel.app</Link>, and other sites we own and operate.</Typography>
          <Typography>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</Typography>
          <Typography>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</Typography>
          <Typography>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</Typography>
          <Typography>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</Typography>
          <Typography>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</Typography>
          <Typography>Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.</Typography>
          <Typography>This policy is effective as of 31 March 2021.</Typography>
          <Typography variant="h4" className="mt-4">Archipel Terms of Service</Typography>
          <Typography variant="h5" className="mt-2">1. Terms</Typography>
          <Typography>By accessing the website at <Link href="https://sensual.education">https://sensual.education</Link>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</Typography>
          <Typography variant="h5" className="mt-2">2. Use License</Typography>
          <ol type="a">
            <li>
              <Typography>
                Permission is granted to temporarily download one copy of the materials (information or software) on Archipel's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                <ol type="i">
                  <li><Typography>modify or copy the materials;</Typography></li>
                  <li><Typography>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</Typography></li>
                  <li><Typography>attempt to decompile or reverse engineer any software contained on Archipel's website;</Typography></li>
                  <li><Typography>remove any copyright or other proprietary notations from the materials; or</Typography></li>
                  <li><Typography>transfer the materials to another person or "mirror" the materials on any other server.</Typography></li>
                </ol>
              </Typography>
            </li>
            <li><Typography>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Archipel at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</Typography></li>
          </ol>
          <Typography variant="h5" className="mt-2">3. Disclaimer</Typography>
          <ol type="a">
            <li><Typography>The materials on Archipel's website are provided on an 'as is' basis. Archipel makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</Typography></li>
            <li><Typography>Further, Archipel does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</Typography></li>
          </ol>
          <Typography variant="h5" className="mt-2">4. Limitations</Typography>
          <Typography>In no event shall Archipel or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Archipel's website, even if Archipel or a Archipel authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</Typography>
          <Typography variant="h5" className="mt-2">5. Accuracy of materials</Typography>
          <Typography>The materials appearing on Archipel's website could include technical, typographical, or photographic errors. Archipel does not warrant that any of the materials on its website are accurate, complete or current. Archipel may make changes to the materials contained on its website at any time without notice. However Archipel does not make any commitment to update the materials.</Typography>
          <Typography variant="h5" className="mt-2">6. Links</Typography>
          <Typography>Archipel has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Archipel of the site. Use of any such linked website is at the user's own risk.</Typography>
          <Typography variant="h5" className="mt-2">7. Modifications</Typography>
          <Typography>Archipel may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</Typography>
          <Typography variant="h5" className="mt-2">8. Governing Law</Typography>
          <Typography>These terms and conditions are governed by and construed in accordance with the laws of France and you irrevocably submit to the exclusive jurisdiction of the courts in that country.</Typography>
        </Paper>
      </Container>
    </div>
  )
}

export default Legal
