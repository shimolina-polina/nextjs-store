import { render } from '@testing-library/react'
import Header from './Header'

describe('Button', () => {
  it('renders correctly without user', () => {
    const { container } = render(<Header title="My App" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders correctly with user', () => {
    const user = {
      name: 'John Doe',
      avatar: '/avatar.jpg'
    } 
    
    const { container } = render(
      <Header title="My App" user={user} />
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})